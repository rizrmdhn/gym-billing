import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';

import { useState } from 'react';

export default function Index({ members, plans }) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({
        name: '', phone: '', address: '', membership_plan_id: '', join_date: '',
    });
    const editForm = useForm({
        name: '', phone: '', address: '', membership_plan_id: '', join_date: '', status: 'active',
    });

    function submitCreate(e) {
        e.preventDefault();
        createForm.post(route('members.store'), { onSuccess: () => createForm.reset() });
    }

    function startEdit(member) {
        setEditingId(member.id);
        editForm.setData({
            name: member.name,
            phone: member.phone,
            address: member.address ?? '',
            membership_plan_id: member.membership_plan_id,
            join_date: member.join_date?.substring(0, 10),
            status: member.status,
        });
    }

    function submitEdit(e, member) {
        e.preventDefault();
        editForm.put(route('members.update', member.id), { onSuccess: () => setEditingId(null) });
    }

    function destroy(member) {
        if (confirm(`Hapus member "${member.name}"?`)) {
            createForm.delete(route('members.destroy', member.id));
        }
    }

    return (
        <AuthLayout title="Member" description="Daftar member yang sudah terdaftar">
            <div className="py-8 max-w-6xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-4">Tambah member baru</h3>
                    <form onSubmit={submitCreate} className="grid grid-cols-5 gap-3 items-start">
                        <input
                            className="border rounded px-3 py-2"
                            placeholder="Nama"
                            value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                        />
                        <input
                            className="border rounded px-3 py-2"
                            placeholder="No. telepon"
                            value={createForm.data.phone}
                            onChange={(e) => createForm.setData('phone', e.target.value)}
                        />
                        <input
                            className="border rounded px-3 py-2"
                            placeholder="Alamat"
                            value={createForm.data.address}
                            onChange={(e) => createForm.setData('address', e.target.value)}
                        />
                        <select
                            className="border rounded px-3 py-2"
                            value={createForm.data.membership_plan_id}
                            onChange={(e) => createForm.setData('membership_plan_id', e.target.value)}
                        >
                            <option value="">Pilih paket</option>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="border rounded px-3 py-2 w-full"
                                value={createForm.data.join_date}
                                onChange={(e) => createForm.setData('join_date', e.target.value)}
                            />
                            <button className="bg-gray-900 text-white px-4 py-2 rounded whitespace-nowrap">
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Telepon</th>
                                <th className="px-4 py-3">Paket</th>
                                <th className="px-4 py-3">Aktif s.d.</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} className="border-t align-top">
                                    {editingId === member.id ? (
                                        <td colSpan={6} className="px-4 py-3">
                                            <form
                                                onSubmit={(e) => submitEdit(e, member)}
                                                className="grid grid-cols-6 gap-2 items-center"
                                            >
                                                <input
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.name}
                                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                                />
                                                <input
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.phone}
                                                    onChange={(e) => editForm.setData('phone', e.target.value)}
                                                />
                                                <select
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.membership_plan_id}
                                                    onChange={(e) => editForm.setData('membership_plan_id', e.target.value)}
                                                >
                                                    {plans.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="date"
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.join_date}
                                                    onChange={(e) => editForm.setData('join_date', e.target.value)}
                                                />
                                                <select
                                                    className="border rounded px-2 py-1"
                                                    value={editForm.data.status}
                                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="suspend">Suspend</option>
                                                </select>
                                                <div className="flex gap-2">
                                                    <button className="text-green-700 font-medium">Simpan</button>
                                                    <button
                                                        type="button"
                                                        className="text-gray-500"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3">{member.name}</td>
                                            <td className="px-4 py-3">{member.phone}</td>
                                            <td className="px-4 py-3">{member.membership_plan?.name}</td>
                                            <td className="px-4 py-3">{member.active_until ?? '-'}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${
                                                        member.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-3">
                                                <button className="text-blue-600" onClick={() => startEdit(member)}>
                                                    Edit
                                                </button>
                                                <button className="text-red-600" onClick={() => destroy(member)}>
                                                    Hapus
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                        Belum ada member.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthLayout>
    );
}
