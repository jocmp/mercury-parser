import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Could not find the requested page.</p>
      <Link href="/" style={{ color: 'blue' }}>
        Go back home
      </Link>
    </div>
  );
}
