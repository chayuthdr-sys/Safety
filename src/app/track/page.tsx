"use client";

import { useState } from "react";
import { getRegistrationById } from "../actions";

type TrackResult = {
  id: number;
  companyName: string;
  trainingDate: Date;
  status: string;
  rejectReason: string | null;
  createdAt: Date;
  workType: string;
};

export default function TrackPage() {
  const [ticketId, setTicketId] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketId) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    const idNum = parseInt(ticketId, 10);
    if (isNaN(idNum)) {
      setError("รหัสคำร้องต้องเป็นตัวเลขเท่านั้น");
      setIsLoading(false);
      return;
    }

    const res = await getRegistrationById(idNum);
    if (res.success && res.data) {
      setResult(res.data as TrackResult);
    } else {
      setError(res.error || "ไม่พบข้อมูลคำร้องนี้");
    }
    
    setIsLoading(false);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "รอดำเนินการ":
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">รอดำเนินการ (Pending)</span>;
      case "อนุมัติ":
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">อนุมัติแล้ว (Approved)</span>;
      case "ตีกลับ":
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">ตีกลับ (Rejected)</span>;
      default:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-800 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            ติดตามสถานะคำร้อง
          </h2>
          <p className="text-slate-300 mt-2">กรุณากรอกรหัสคำร้อง (Request ID) เพื่อตรวจสอบสถานะ</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="เช่น 1234"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="flex-grow border border-gray-300 rounded-md px-4 py-3 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
            />
            <button 
              type="submit" 
              disabled={isLoading || !ticketId}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-center">
              {error}
            </div>
          )}

          {result && (
            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
                <div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest mb-1">รหัสคำร้อง</div>
                  <div className="text-3xl font-mono font-bold text-emerald-700">{result.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 mb-2">สถานะปัจจุบัน</div>
                  {getStatusBadge(result.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500">ชื่อบริษัท</div>
                  <div className="font-medium text-slate-800 text-lg">{result.companyName}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-500">ประเภทงาน</div>
                    <div className="font-medium text-slate-800">{result.workType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">วันที่ยื่นเรื่อง</div>
                    <div className="font-medium text-slate-800">{new Date(result.createdAt).toLocaleDateString('th-TH')}</div>
                  </div>
                </div>

                {result.status === "ตีกลับ" && result.rejectReason && (
                  <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-md">
                    <div className="text-sm font-bold text-red-800 mb-1">เหตุผลที่ตีกลับ:</div>
                    <div className="text-red-700">{result.rejectReason}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
