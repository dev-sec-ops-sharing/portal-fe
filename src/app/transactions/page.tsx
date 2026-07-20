import Link from 'next/link';

interface PageProps {
  readonly searchParams?: {
    readonly query?: string;
  };
}

function getStatusStyle(status: string) {
  if (status === 'SUCCESS') {
    return 'bg-green-50 text-green-700';
  }
  if (status === 'PENDING') {
    return 'bg-amber-50 text-amber-700';
  }
  return 'bg-red-50 text-red-700';
}

const API_URL = process.env.API_URL || 'http://localhost:8080';

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

async function getTransactions(query?: string) {
  try {
    const url = query 
      ? `${API_URL}/transactions/search?userId=${encodeURIComponent(query)}`
      : `${API_URL}/transactions`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const query = searchParams?.query || "";

  // Fetch real data from the API
  const rawTransactions = await getTransactions(query);
  
  // Map Prisma model to frontend format
  const transactions: Transaction[] = rawTransactions.map((t: { id: string; userId: string; amount: number; status: string; createdAt: string }) => ({
    id: t.id,
    customer: t.userId, // Using userId as customer for demo
    amount: t.amount,
    status: t.status,
    date: new Date(t.createdAt).toLocaleDateString('en-CA'),
  }));

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 p-12">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
          <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Search bar */}
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="query"
            placeholder="Search by customer name..."
            defaultValue={query}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700">
            Search
          </button>
        </form>

        {/* SECURE: Query is rendered safely as a standard React text node using escaped quotes to prevent JSX warnings and XSS */}
        {query && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800">
            <span className="font-semibold">Search results for: </span>
            <span className="italic">&ldquo;{query}&rdquo;</span>
          </div>
        )}

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t: Transaction) => t.customer.toLowerCase().includes(query.toLowerCase()))
                .map((t: Transaction) => (
                  <tr key={t.id} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50">
                    <td className="p-4 font-mono font-semibold">{t.id}</td>
                    <td className="p-4 font-medium">{t.customer}</td>
                    <td className="p-4">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.amount)}
                    </td>
                    <td className="p-4 text-sm">{t.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
