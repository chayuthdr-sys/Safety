"use client";

import { useState } from "react";
import { updateRegistrationStatus } from "../actions";

type Registration = {
  id: number;
  companyName: string;
  coordinatorEmail: string;
  jobDetails: string;
  workPeriod: string;
  contractorNames: string;
  equipmentList: string;
  trainingDate: Date;
  workType: string;
  idCardPdfPath: string;
  socialSecurityPdfPath: string;
  craneDoc1Path: string | null;
  craneCertPath: string | null;
  cranePlanPath: string | null;
  confinedHealthCheckPath: string | null;
  confinedCertPath: string | null;
  status: string;
  rejectReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminTable({ initialData }: { initialData: Registration[] }) {
  const [data, setData] = useState(initialData);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "รอดำเนินการ":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">รอดำเนินการ</span>;
      case "อนุมัติ":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">อนุมัติ</span>;
      case "ตีกลับ":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">ตีกลับ</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleStatusChange = async (id: number, newStatus: string, reason?: string) => {
    setIsProcessing(true);
    const result = await updateRegistrationStatus(id, newStatus, reason);
    if (result.success && result.data) {
      setData(data.map(item => item.id === id ? { ...item, status: newStatus, rejectReason: reason || null } : item));
      if (newStatus === "ตีกลับ") {
        setIsRejecting(false);
        setRejectReason("");
      }
    } else {
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
    setIsProcessing(false);
  };

  const MinioLink = ({ path, label }: { path: string | null, label: string }) => {
    if (!path) return null;
    // Assuming MinIO is accessible via http://localhost:9000 for local viewing
    const url = `http://localhost:9000${path}`;
    return (
      <a href={url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-1 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        {label}
      </a>
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-sm">
              <th className="p-4 font-semibold">รหัส</th>
              <th className="p-4 font-semibold">บริษัท / ผู้ประสานงาน</th>
              <th className="p-4 font-semibold">ประเภทงาน</th>
              <th className="p-4 font-semibold">วันที่เริ่ม - สิ้นสุด</th>
              <th className="p-4 font-semibold text-center">สถานะ</th>
              <th className="p-4 font-semibold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">ไม่มีข้อมูลการลงทะเบียน</td></tr>
            ) : data.map(row => (
              <tr key={row.id} className="hover:bg-slate-50 transition">
                <td className="p-4 text-sm text-slate-600">#{row.id}</td>
                <td className="p-4">
                  <div className="font-medium text-slate-800">{row.companyName}</div>
                  <div className="text-sm text-slate-500">{row.coordinatorEmail}</div>
                </td>
                <td className="p-4 text-sm text-slate-700">{row.workType}</td>
                <td className="p-4 text-sm text-slate-700">{row.workPeriod}</td>
                <td className="p-4 text-center">{getStatusBadge(row.status)}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setSelectedReg(row)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">ดูข้อมูล/เอกสาร</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">รายละเอียดคำขอ #{selectedReg.id}</h3>
              <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedReg.status === "ตีกลับ" && selectedReg.rejectReason && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md text-sm">
                  <span className="font-bold">เหตุผลที่ตีกลับ: </span> {selectedReg.rejectReason}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div><span className="text-slate-500 block">บริษัท:</span> <span className="font-medium">{selectedReg.companyName}</span></div>
                <div><span className="text-slate-500 block">ผู้ประสานงาน:</span> <span className="font-medium">{selectedReg.coordinatorEmail}</span></div>
                <div><span className="text-slate-500 block">รายละเอียดงาน:</span> <span className="font-medium">{selectedReg.jobDetails}</span></div>
                <div><span className="text-slate-500 block">ระยะเวลา:</span> <span className="font-medium">{selectedReg.workPeriod}</span></div>
                <div><span className="text-slate-500 block">วันที่อบรม:</span> <span className="font-medium">{new Date(selectedReg.trainingDate).toLocaleDateString('th-TH')}</span></div>
                <div><span className="text-slate-500 block">ประเภทงาน:</span> <span className="font-medium">{selectedReg.workType}</span></div>
                <div className="md:col-span-2"><span className="text-slate-500 block">รายชื่อผู้รับเหมา:</span> <span className="font-medium whitespace-pre-wrap">{selectedReg.contractorNames}</span></div>
                <div className="md:col-span-2"><span className="text-slate-500 block">อุปกรณ์/เครื่องจักร:</span> <span className="font-medium">{selectedReg.equipmentList}</span></div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-slate-800 mb-3">เอกสารแนบ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded border border-slate-100">
                  <MinioLink path={selectedReg.idCardPdfPath} label="บัตรประชาชน/ต่างด้าว" />
                  <MinioLink path={selectedReg.socialSecurityPdfPath} label="บัตรประกันสังคม" />
                  <MinioLink path={selectedReg.craneDoc1Path} label="ปจ.1 / ปจ.2" />
                  <MinioLink path={selectedReg.craneCertPath} label="Certificate ปั้นจั่น" />
                  <MinioLink path={selectedReg.cranePlanPath} label="แผนงานยก" />
                  <MinioLink path={selectedReg.confinedHealthCheckPath} label="ผลตรวจสุขภาพ" />
                  <MinioLink path={selectedReg.confinedCertPath} label="Certificate อับอากาศ" />
                </div>
              </div>

              {selectedReg.status === "รอดำเนินการ" && (
                <div className="border-t border-slate-200 pt-6 flex justify-end gap-3">
                  {!isRejecting ? (
                    <>
                      <button 
                        onClick={() => setIsRejecting(true)}
                        disabled={isProcessing}
                        className="px-4 py-2 border border-red-500 text-red-600 rounded hover:bg-red-50 transition"
                      >
                        ตีกลับ (Reject)
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedReg.id, "อนุมัติ")}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                      >
                        {isProcessing ? "กำลังดำเนินการ..." : "อนุมัติ (Approve)"}
                      </button>
                    </>
                  ) : (
                    <div className="w-full space-y-3">
                      <textarea 
                        className="w-full border border-gray-300 rounded p-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="ระบุเหตุผลที่ตีกลับ..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setIsRejecting(false)}
                          className="px-4 py-2 text-slate-500 hover:text-slate-700"
                        >
                          ยกเลิก
                        </button>
                        <button 
                          onClick={() => handleStatusChange(selectedReg.id, "ตีกลับ", rejectReason)}
                          disabled={!rejectReason || isProcessing}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          ยืนยันการตีกลับ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
