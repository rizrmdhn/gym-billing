import AuthLayout from "@/layouts/auth-layout";
import {router, useForm} from "@inertiajs/react";

export default function InvoiceIndex({invoices, filters}) {
    const generateForm = useForm({
        month: filters.month,
        year: filters.year,
    });

    function changePeriod(field, value) {
        const next = { ...filters, [field]: value };
        router.get(route('invoices.index'), next, {
            preserveState: true,
        });
    }

    function generate(e) {
        e.preventDefault();
        generateForm.data.month = filters.month;
        generateForm.data.year = filters.year;
        generateForm.post(route('invoices.generate'))
    }

    function pay(invoice) {
        if (confirm(`Are you sure you want to pay invoice #${invoice.id}, with a total amount of $${invoice.total_amount.toFixed(2)}?`)) {
            // Proceed with payment logic
            router.post(route('invoices.store', invoice.id));
        }
    }

    return (
        <AuthLayout title="Invoice" description="Daftar invoice yang sudah dibuat">
            <div className="py-8 max-w-5xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow p-6 flex items-end gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Bulan</label>
                        <select
                            className="border rounded px-3 py-2"
                            value={filters.month}
                            onChange={(e) => changePeriod('month', e.target.value)}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Tahun</label>
                        <input
                            type="number"
                            className="border rounded px-3 py-2 w-24"
                            value={filters.year}
                            onChange={(e) => changePeriod('year', e.target.value)}
                        />
                    </div>
                    <button
                        onClick={generate}
                        disabled={generateForm.processing}
                        className="bg-gray-900 text-white px-4 py-2 rounded"
                    >
                        Generate invoice bulan ini
                    </button>
                    <p className="text-sm text-gray-500">
                        Aman diklik berkali-kali — invoice yang sudah ada tidak akan dobel.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-3">No. invoice</th>
                                <th className="px-4 py-3">Member</th>
                                <th className="px-4 py-3">Subtotal</th>
                                <th className="px-4 py-3">Pajak (11%)</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="border-t">
                                    <td className="px-4 py-3 font-mono text-xs">{inv.invoice_number}</td>
                                    <td className="px-4 py-3">{inv.member?.name}</td>
                                    <td className="px-4 py-3">Rp {Number(inv.subtotal).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3">Rp {Number(inv.tax_amount).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 font-medium">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${
                                                inv.status === 'paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {inv.status !== 'paid' && (
                                            <button className="text-blue-600" onClick={() => pay(inv)}>
                                                Catat pembayaran
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                        Belum ada invoice untuk periode ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthLayout>
    )
}
