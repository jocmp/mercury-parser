'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ParseResult, Mercury as MercuryType } from 'mercury';

function WebDemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [Mercury, setMercury] = useState<MercuryType | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const urlParam = searchParams.get('q') || '';
  const defaultParam = searchParams.get('default') === '1';
  const [forceDefault, setForceDefault] = useState(defaultParam);

  useEffect(() => {
    setInputUrl(urlParam);
  }, [urlParam]);

  useEffect(() => {
    setForceDefault(defaultParam);
  }, [defaultParam]);

  useEffect(() => {
    // Dynamically import Mercury for client-side
    import('mercury')
      .then(mod => {
        setMercury(() => mod.default);
      })
      .catch(err => {
        setLoadError(err.message);
      });
  }, []);

  useEffect(() => {
    if (!Mercury || !urlParam) return;

    const fetchAndParse = async () => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        let data;

        if (defaultParam) {
          const response = await fetch('/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlParam, forceDefault: true }),
          });
          data = await response.json();
        } else {
          // Fetch HTML via API to bypass CORS
          const fetchRes = await fetch('/api/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlParam }),
          });
          const { html, error: fetchError } = await fetchRes.json();

          if (fetchError) {
            setError(fetchError);
            return;
          }

          data = await Mercury.parse(urlParam, { html, fetchAllPages: false });
        }

        if (data.error) {
          setError(data.message || 'Parse failed');
        } else {
          setResult(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAndParse();
  }, [Mercury, urlParam, defaultParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Mercury || !inputUrl) return;
    const params = new URLSearchParams({ q: inputUrl });
    if (forceDefault) params.set('default', '1');
    router.push(`/web?${params}`);
  };

  if (loadError) {
    return (
      <div>
        <Link href="/" style={{ color: 'blue' }}>
          &larr; Back
        </Link>
        <h1 style={{ marginTop: '1rem' }}>Web</h1>
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fee',
            color: 'red',
          }}
        >
          Failed to load Mercury: {loadError}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" style={{ color: 'blue' }}>
        &larr; Back
      </Link>

      <h1 style={{ marginTop: '1rem' }}>Web</h1>
      <p>Parses HTML client-side</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <input
          type="url"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          placeholder="Enter URL to parse"
          style={{
            width: '400px',
            padding: '0.5rem',
            fontSize: '1rem',
            marginRight: '1rem',
          }}
        />
        <button
          type="submit"
          disabled={loading || !Mercury}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          {!Mercury ? 'Loading...' : loading ? 'Parsing...' : 'Parse'}
        </button>
        <label
          style={{
            marginLeft: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={forceDefault}
            onChange={e => setForceDefault(e.target.checked)}
          />
          Default parser
        </label>
      </form>

      {error && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fee',
            color: 'red',
          }}
        >
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Result</h2>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div>
              <strong>Title:</strong> {result.title}
            </div>
            <div>
              <strong>Author:</strong> {result.author || '(none)'}
            </div>
            <div>
              <strong>Date:</strong> {result.date_published || '(none)'}
            </div>
            <div>
              <strong>Excerpt:</strong> {result.excerpt || '(none)'}
            </div>
            {result.lead_image_url && (
              <div>
                <strong>Lead Image:</strong>
                <br />
                <img
                  src={result.lead_image_url}
                  alt="Lead"
                  style={{ maxWidth: '300px', marginTop: '0.5rem' }}
                />
              </div>
            )}
            <details>
              <summary style={{ cursor: 'pointer' }}>Raw JSON</summary>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
            <div>
              <strong>Content:</strong>
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: '#f5f5f5',
                }}
                dangerouslySetInnerHTML={{ __html: result.content || '' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WebDemo() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WebDemoContent />
    </Suspense>
  );
}
