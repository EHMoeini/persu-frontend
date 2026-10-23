import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h3>Page not found</h3>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Go home</Link>
    </>
  );
}
