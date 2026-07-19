import Link from 'next/link';

const API_URL = process.env.API_URL || 'http://localhost:8080';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  createdAt: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PAID': return 'bg-green-100 text-green-700';
    case 'PENDING': return 'bg-yellow-100 text-yellow-700';
    case 'OVERDUE': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

async function getInvoices() {
  try {
    const res = await fetch(`${API_URL}/invoices`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-500 mt-2">Manage your customer invoices securely.</p>
          </div>
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            &larr; Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Invoice Number</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No invoices found. Ensure the API is running at {API_URL}.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice: Invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{invoice.number}</td>
                    <td className="p-4 text-slate-600">{invoice.customer}</td>
                    <td className="p-4 font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
