import assert from 'assert';
import URL from 'url';

import { record } from '../../test-recorder';
import fetchResource, {
  baseDomain,
  validateResponse,
  buildRequestOptions,
  get,
} from '../../../src/resource/utils/fetch-resource';
import { MAX_CONTENT_LENGTH } from '../../../src/resource/utils/constants';

describe('fetchResource(url)', () => {
  const recorder = record('fetch-resource-test');
  beforeAll(recorder.before);
  afterAll(recorder.after);

  it('returns appropriate json for bad url', async () => {
    const url = 'http://www.nytimes.com/500';
    const { error } = await fetchResource(url);

    assert.strictEqual(error, true);
  });

  it('passes custom headers in requests', async () => {
    // A GET request to this endpoint returns the list of all request headers as part of the response JSON
    const url = 'https://postman-echo.com/headers';
    const parsedUrl = URL.parse(url);
    const headers = {
      'my-custom-header': 'Lorem ipsum dolor sit amet',
    };
    const result = await fetchResource(url, parsedUrl, headers);
    const body = JSON.parse(result.body.toString());

    assert.strictEqual(
      body.headers['my-custom-header'],
      'Lorem ipsum dolor sit amet'
    );
  });

  it('returns a buffer as its body', async () => {
    const url =
      'http://www.nytimes.com/2016/08/16/upshot/the-state-of-the-clinton-trump-race-is-it-over.html?_r=0';
    const result = await fetchResource(url);

    assert.strictEqual(typeof result.body, 'object');
  });

  it('fetches nyt', async () => {
    const url =
      'http://www.nytimes.com/2016/08/16/upshot/the-state-of-the-clinton-trump-race-is-it-over.html?_r=0';
    const { response } = await fetchResource(url);

    assert.strictEqual(response.statusCode, 200);
  });

  it('fetches domains', async () => {
    const url = 'http://theconcourse.deadspin.com/1786177057';
    const { response } = await fetchResource(url);

    assert.strictEqual(response.statusCode, 200);
  });

  it('fetches nyt', async () => {
    const url =
      'http://www.nytimes.com/2016/08/16/upshot/the-state-of-the-clinton-trump-race-is-it-over.html?_r=0';
    const { response } = await fetchResource(url);

    assert.strictEqual(response.statusCode, 200);
  });

  it('handles this gzip error', async () => {
    const url =
      'http://www.redcross.ca/blog/2016/11/photo-of-the-day--one-year-anniversary-of-the-end-of-ebola-in-sierra-leone';
    const { response } = await fetchResource(url);

    assert.strictEqual(response.statusCode, 200);
  });
});

describe('validateResponse(response)', () => {
  it('validates a response object', () => {
    const validResponse = {
      statusMessage: 'OK',
      statusCode: 200,
      headers: {
        'content-type': 'text/html',
        'content-length': 500,
      },
    };

    assert.strictEqual(validateResponse(validResponse), true);
  });

  it('throws an error if there is no status code', () => {
    const invalidResponse = {};

    assert.throws(() => {
      validateResponse(invalidResponse);
    }, /unable to fetch content/i);
  });

  it('throws an error if response code is not 200', () => {
    const invalidResponse = {
      statusCode: 500,
    };

    assert.throws(() => {
      validateResponse(invalidResponse);
    }, /instructed to reject non-200/i);
  });

  it('throws an error if response has bad content-type', () => {
    const invalidResponse = {
      statusMessage: 'OK',
      statusCode: 200,
      headers: {
        'content-type': 'image/gif',
        'content-length': 500,
      },
    };

    assert.throws(() => {
      validateResponse(invalidResponse);
    }, /content-type for this resource/i);
  });

  it('throws an error if response length is > max', () => {
    const invalidResponse = {
      statusMessage: 'OK',
      statusCode: 200,
      headers: {
        'content-type': 'text/html',
        'content-length': MAX_CONTENT_LENGTH + 1,
      },
    };

    assert.throws(() => {
      validateResponse(invalidResponse);
    }, /Content for this resource was too large/i);
  });
});

describe('fetch hardening', () => {
  it('bounds the response size and isolates cookies per request', () => {
    const parsedUrl = URL.parse('http://example.com/');
    const options = buildRequestOptions('http://example.com/', parsedUrl, {});

    // Cap the streamed (decompressed) body so an oversized/chunked body or a
    // gzip bomb cannot exhaust memory.
    assert.strictEqual(options.maxResponseSize, MAX_CONTENT_LENGTH);

    // A per-request cookie jar, not the process-wide shared jar (`jar: true`),
    // which would accumulate cookies for every domain forever.
    assert.notStrictEqual(options.jar, true);
    assert.strictEqual(typeof options.jar, 'object');
    assert.ok(options.jar);
  });

  it('aborts a fetch that exceeds the maximum total time', async () => {
    let aborted = false;
    // A requester that never invokes its callback — simulates a slow-trickle
    // response that keeps resetting the inter-byte timeout.
    const hangingRequester = () => ({
      abort: () => {
        aborted = true;
      },
    });

    await assert.rejects(
      () => get({}, { maxFetchTime: 20, requester: hangingRequester }),
      /exceeded maximum/i
    );
    assert.strictEqual(aborted, true);
  });
});

describe('baseDomain(parsedUrl)', () => {
  it('returns the base domain, excluding subdomain', () => {
    const url = 'https://www.npmjs.com/package/request#streaming';
    const parsedUrl = URL.parse(url);

    assert.strictEqual(baseDomain(parsedUrl), 'npmjs.com');
  });

  it('returns the base domain as is if no subdomain', () => {
    const url = 'https://npmjs.com/package/request#streaming';
    const parsedUrl = URL.parse(url);

    assert.strictEqual(baseDomain(parsedUrl), 'npmjs.com');
  });
});
