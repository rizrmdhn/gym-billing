import AuthLayout from '@/layouts/auth-layout';
import { router, useForm } from '@inertiajs/react';
import { generate as generateInvoices, index as invoicesIndex } from '@/routes/invoices';
import { store as payInvoice } from '@/actions/App/Http/Controllers/PaymentController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SubmitEvent } from 'react';

type InvoiceMember = {
    name?: string | null;
};

type InvoiceItem = {
    id: number;
    invoice_number: string;
    subtotal: number | string;
    tax_amount: number | string;
    total_amount: number | string;
    status: 'paid' | 'unpaid' | string;
    member?: InvoiceMember | null;
};

type InvoiceFilters = {
    month: string | number;
    year: string | number;
};

type InvoiceProps = {
    invoices: InvoiceItem[];
    filters: InvoiceFilters;
};

export default function Invoice({ invoices, filters }: InvoiceProps) {
    const generateForm = useForm({
        month: filters.month,
        year: filters.year,
    });

    function changePeriod(field: keyof InvoiceFilters, value: string) {
        const next = { ...filters, [field]: value };
        router.get(invoicesIndex().url, next, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function generate(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        generateForm.setData({
            month: filters.month,
            year: filters.year,
        });
        generateForm.post(generateInvoices().url, {
            preserveScroll: true,
        });
    }

    function pay(invoice: InvoiceItem) {
        if (
            confirm(
                `Are you sure you want to pay invoice #${invoice.id}, with a total amount of Rp ${formatCurrency(invoice.total_amount)}?`
            )
        ) {
            router.post(payInvoice(invoice.id).url, {}, { preserveScroll: true });
        }
    }

    function formatCurrency(value: number | string): string {
        return Number(value).toLocaleString('id-ID');
    }

    return (
        <AuthLayout title="Invoice" description="Daftar invoice yang sudah dibuat">
            <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 lg:px-6">
                <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
                    <CardHeader className="space-y-2">
                        <CardTitle>Periode invoice</CardTitle>
                        <CardDescription>
                            Pilih bulan dan tahun untuk memfilter invoice lalu buat invoice baru untuk periode tersebut.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={generate} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                            <div className="grid gap-2">
                                <Label htmlFor="invoice-month">Bulan</Label>
                                <Select
                                    value={String(filters.month)}
                                    onValueChange={(value) => changePeriod('month', value)}
                                >
                                    <SelectTrigger id="invoice-month" className="w-full">
                                        <SelectValue placeholder="Pilih bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                                            <SelectItem key={month} value={String(month)}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="invoice-year">Tahun</Label>
                                <Input
                                    id="invoice-year"
                                    type="number"
                                    value={filters.year}
                                    onChange={(event) => changePeriod('year', event.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 lg:items-start">
                                <Label className="opacity-0">Aksi</Label>
                                <Button type="submit" disabled={generateForm.processing} className="w-full lg:w-auto">
                                    Generate invoice periode ini
                                </Button>
                            </div>
                        </form>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Aman diklik berkali-kali. Invoice yang sudah ada tidak akan dibuat ulang.
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
                    <CardHeader className="border-b px-6 py-5">
                        <CardTitle>Daftar invoice</CardTitle>
                        <CardDescription>{invoices.length} invoice pada periode yang dipilih.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">No. invoice</th>
                                        <th className="px-6 py-4 font-medium">Member</th>
                                        <th className="px-6 py-4 font-medium">Subtotal</th>
                                        <th className="px-6 py-4 font-medium">Pajak (11%)</th>
                                        <th className="px-6 py-4 font-medium">Total</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-t border-border/60">
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                {invoice.invoice_number}
                                            </td>
                                            <td className="px-6 py-4 font-medium">{invoice.member?.name ?? '-'}</td>
                                            <td className="px-6 py-4">Rp {formatCurrency(invoice.subtotal)}</td>
                                            <td className="px-6 py-4">Rp {formatCurrency(invoice.tax_amount)}</td>
                                            <td className="px-6 py-4 font-semibold">
                                                Rp {formatCurrency(invoice.total_amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={invoice.status === 'paid' ? 'secondary' : 'outline'}
                                                    className={
                                                        invoice.status === 'paid'
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : 'border-amber-200 bg-amber-50 text-amber-700'
                                                    }
                                                >
                                                    {invoice.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {invoice.status !== 'paid' ? (
                                                    <Button variant="ghost" size="sm" onClick={() => pay(invoice)}>
                                                        Catat pembayaran
                                                    </Button>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                                                Belum ada invoice untuk periode ini.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    )
}

Invoice.layout = {
    title: 'Invoice',
    description: 'Daftar invoice yang sudah dibuat',
};
