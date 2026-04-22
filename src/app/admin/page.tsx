import { prisma } from "@/lib/prisma";
import AdminTable from "./AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ระบบจัดการผู้รับเหมา (Admin Dashboard)</h2>
          <p className="text-gray-500">จัดการคำขอลงทะเบียนเข้าทำงานของผู้รับเหมา</p>
        </div>
        <a 
          href="/api/export" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded shadow transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          ส่งออกเป็น Excel
        </a>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <AdminTable initialData={registrations} />
      </div>
    </div>
  );
}
