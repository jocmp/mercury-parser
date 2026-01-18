'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ParseResult } from 'mercury';

function NodeDemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlParam = searchParams.get('q') || '';

  useEffect(() => {
    setInputUrl(urlParam);
  }, [urlParam]);

  useEffect(() => {
    if (!urlParam) return;

    const fetchParse = async () => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await fetch('/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlParam }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setResult(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchParse();
  }, [urlParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    router.push(`/node?q=${encodeURIComponent(inputUrl)}`);
  };

  return (
    <div>
      <Link href="/" style={{ color: 'blue' }}>
        &larr; Back
      </Link>

      <h1 style={{ marginTop: '1rem' }}>Node</h1>
      <p>Parses URLs server-side</p>

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
          disabled={loading}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          {loading ? 'Parsing...' : 'Parse'}
        </button>
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

export default function NodeDemo() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NodeDemoContent />
    </Suspense>
  );
}
