"use client";

import { useState } from "react";
import { submitRegistration } from "./actions";

export default function RegistrationForm() {
  const [workType, setWorkType] = useState("งานทั่วไป");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [error, setError] = useState("");

  const workTypes = [
    "งานทั่วไป",
    "งานที่ก่อให้เกิดความร้อนหรือประกายไฟ",
    "การทำงานบนที่สูง (ตั้งแต่ 2 เมตรขึ้นไป)",
    "งานเกี่ยวกับไฟฟ้า",
    "งานยกโดยใช้ปั้นจั่น",
    "งานที่อับอากาศ",
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitRegistration(formData);

    if (result.success && result.data) {
      setSuccessData(result.data);
    } else {
      setError(result.error || "เกิดข้อผิดพลาด");
    }
    
    setIsSubmitting(false);
  }

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md text-center border-t-8 border-emerald-500 print:shadow-none print:border-none print:mt-0">
        <div className="text-emerald-500 mb-4 print:hidden">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ลงทะเบียนสำเร็จ</h2>
        <p className="text-gray-600 mb-6 print:hidden">ข้อมูลของคุณได้รับการบันทึกเรียบร้อยแล้ว สถานะปัจจุบันคือ "รอดำเนินการ"</p>
        
        <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200 print:border-black print:bg-white text-left max-w-sm mx-auto">
          <div className="text-center mb-4">
            <div className="text-sm text-slate-500 uppercase tracking-widest">รหัสคำร้องของคุณ</div>
            <div className="text-4xl font-mono font-bold text-emerald-700 tracking-wider mt-1">{successData.id}</div>
          </div>
          <div className="space-y-2 text-sm text-slate-700 border-t border-slate-200 pt-4 print:border-black">
            <div className="flex justify-between"><span className="text-slate-500">บริษัท:</span> <span className="font-medium text-right">{successData.companyName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">ประเภทงาน:</span> <span className="font-medium text-right">{successData.workType}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">วันที่ยื่นเรื่อง:</span> <span className="font-medium text-right">{new Date(successData.createdAt).toLocaleDateString('th-TH')}</span></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
          <button 
            onClick={() => window.print()} 
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-6 rounded transition flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            พิมพ์ตั๋วคำร้อง
          </button>
          <button 
            onClick={() => { setSuccessData(null); setWorkType("งานทั่วไป"); }} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            ลงทะเบียนใหม่
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-6 print:hidden">
          กรุณาจดจำรหัสคำร้องนี้ไว้ เพื่อใช้ตรวจสอบสถานะการเข้าทำงานของคุณ
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-emerald-600 p-6 text-white">
        <h2 className="text-2xl font-bold">ฟอร์มลงทะเบียนผู้รับเหมาเข้าทำงาน</h2>
        <p className="text-emerald-100 mt-2">กรุณากรอกข้อมูลและแนบเอกสารให้ครบถ้วน</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ชื่อบริษัท <span className="text-red-500">*</span></label>
            <input type="text" name="companyName" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">E-mail ผู้ประสานงาน <span className="text-red-500">*</span></label>
            <input type="email" name="coordinatorEmail" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">รายละเอียดงาน <span className="text-red-500">*</span></label>
          <input type="text" name="jobDetails" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ระยะเวลาที่เข้าทำงาน <span className="text-red-500">*</span></label>
            <input type="text" name="workPeriod" placeholder="เช่น 1 ม.ค. - 5 ม.ค. 2567" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">วันที่สะดวกเข้าอบรมความปลอดภัยก่อนเริ่มงาน <span className="text-red-500">*</span></label>
            <input type="date" name="trainingDate" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">รายชื่อผู้รับเหมาที่เข้าทำงาน <span className="text-red-500">*</span></label>
          <textarea name="contractorNames" rows={4} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" placeholder="ระบุรายชื่อผู้รับเหมาทั้งหมด"></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">อุปกรณ์, เครื่องจักร <span className="text-red-500">*</span></label>
          <input type="text" name="equipmentList" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" placeholder="ระบุอุปกรณ์หรือเครื่องจักรที่นำเข้ามา" />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ประเภทงาน</h3>
          <div className="space-y-2">
            <select 
              name="workType" 
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
            >
              {workTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">เอกสารแนบ (PDF)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">บัตรประจำตัวประชาชน/บัตรต่างด้าว <span className="text-red-500">*</span></label>
              <input type="file" name="idCard" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">หน้าบัตรประกันสังคม/ประกันอื่นๆ <span className="text-red-500">*</span></label>
              <input type="file" name="socialSecurity" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
            </div>
          </div>

          {/* Conditional Uploads: Crane Work */}
          {workType === "งานยกโดยใช้ปั้นจั่น" && (
            <div className="space-y-4 bg-orange-50 p-4 rounded-lg border border-orange-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <h4 className="font-medium text-orange-800">เอกสารเพิ่มเติมสำหรับ: งานยกโดยใช้ปั้นจั่น</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">1. เอกสาร ปจ. 1/ปจ.2 <span className="text-red-500">*</span></label>
                  <input type="file" name="craneDoc1" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-orange-700 hover:file:bg-orange-100 transition" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">2. ใบ Certificate (ผู้บังคับ, ผู้ให้สัญญาณ, ผู้ยึดเกาะ, ผู้ควบคุม) <span className="text-red-500">*</span></label>
                  <input type="file" name="craneCert" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-orange-700 hover:file:bg-orange-100 transition" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">3. แผนงานยก <span className="text-red-500">*</span></label>
                  <input type="file" name="cranePlan" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-orange-700 hover:file:bg-orange-100 transition" />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Uploads: Confined Space */}
          {workType === "งานที่อับอากาศ" && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <h4 className="font-medium text-blue-800">เอกสารเพิ่มเติมสำหรับ: งานที่อับอากาศ</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">1. ผลการตรวจสุขภาพ <span className="text-red-500">*</span></label>
                  <input type="file" name="confinedHealth" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-blue-700 hover:file:bg-blue-100 transition" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">2. ใบ Certificate (ผู้ควบคุม, ผู้ช่วยเหลือ, ผู้ปฏิบัติงาน) <span className="text-red-500">*</span></label>
                  <input type="file" name="confinedCert" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-blue-700 hover:file:bg-blue-100 transition" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-sm flex justify-center items-center gap-2 transition ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังส่งข้อมูล...
              </>
            ) : "ส่งข้อมูลลงทะเบียน"}
          </button>
        </div>
      </form>
    </div>
  );
}
