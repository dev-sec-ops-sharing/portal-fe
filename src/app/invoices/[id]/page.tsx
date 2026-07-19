import Link from 'next/link';

const API_URL = process.env.API_URL || 'http://localhost:8080';

function getStatusColor(status: string) {
  switch (status) {
    case 'PAID': return 'bg-green-100 text-green-700';
    case 'PENDING': return 'bg-yellow-100 text-yellow-700';
    case 'OVERDUE': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

async function getInvoice(id: string) {
  try {
    const res = await fetch(`${API_URL}/invoices/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch invoice');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 md:p-24 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Invoice Not Found</h1>
        <Link href="/invoices" className="text-blue-600 hover:underline">
          Return to Invoices
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/invoices" className="text-blue-600 hover:underline font-medium flex items-center">
            &larr; Back to Invoices
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 font-semibold tracking-wider uppercase mb-1">Invoice</p>
              <h1 className="text-3xl font-bold text-slate-900">{invoice.number}</h1>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-slate-500 mb-1">Customer</p>
              <p className="font-semibold text-lg text-slate-900">{invoice.customer}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Amount</p>
              <p className="font-bold text-2xl text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Created At</p>
              <p className="font-medium text-slate-900">
                {new Date(invoice.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Due Date</p>
              <p className="font-medium text-slate-900">
                {new Date(invoice.dueDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                {invoice.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
