import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4 text-center">
          DevSecOps <span className="text-blue-600">Demo Portal</span>
        </h1>
        <p className="text-lg text-slate-600 text-center max-w-2xl">
          Welcome to the secure invoice management system. This portal demonstrates a complete DevSecOps lifecycle with automated security scanning, container security, and dynamic application security testing.
        </p>
        
        <div className="flex gap-4 mt-8">
          <Link 
            href="/invoices"
            className="rounded-full bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Manage Invoices
          </Link>
          <Link 
            href="/transactions"
            className="rounded-full bg-slate-800 px-8 py-4 text-white font-semibold hover:bg-slate-900 transition-colors shadow-lg hover:shadow-xl"
          >
            View Transactions
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-8 py-4 text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            View Architecture
          </a>
        </div>
      </div>
    </main>
  );
}
