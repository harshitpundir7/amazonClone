import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-amzn-text-primary mb-4">404</h1>
      <p className="text-lg text-amzn-text-secondary mb-2">Page not found</p>
      <p className="text-sm text-amzn-text-tertiary mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-amzn-teal hover:text-amzn-teal-hover hover:underline"
      >
        Go to homepage
      </Link>
    </div>
  );
}
