import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Mercury Parser Demo</h1>
      <p>Test the parser from source (no dist build required)</p>

      <nav style={{ marginTop: '2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem' }}>
            <Link
              href="/node"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              Node
            </Link>
            <span style={{ color: '#666', marginLeft: '1rem' }}>
              Server-side parsing via API route
            </span>
          </li>
          <li>
            <Link
              href="/web"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              Web
            </Link>
            <span style={{ color: '#666', marginLeft: '1rem' }}>
              Client-side parsing in the browser
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}
