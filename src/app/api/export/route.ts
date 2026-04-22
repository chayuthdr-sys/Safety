import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registrations");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "ชื่อบริษัท", key: "companyName", width: 25 },
      { header: "E-mail ผู้ประสานงาน", key: "coordinatorEmail", width: 25 },
      { header: "รายละเอียดงาน", key: "jobDetails", width: 30 },
      { header: "ระยะเวลาที่เข้าทำงาน", key: "workPeriod", width: 20 },
      { header: "วันที่สะดวกเข้าอบรม", key: "trainingDate", width: 20 },
      { header: "ประเภทงาน", key: "workType", width: 25 },
      { header: "รายชื่อผู้รับเหมา", key: "contractorNames", width: 40 },
      { header: "อุปกรณ์/เครื่องจักร", key: "equipmentList", width: 30 },
      { header: "สถานะ", key: "status", width: 15 },
      { header: "เหตุผลที่ตีกลับ", key: "rejectReason", width: 30 },
      { header: "วันที่ลงทะเบียน", key: "createdAt", width: 20 },
    ];

    registrations.forEach(reg => {
      worksheet.addRow({
        id: reg.id,
        companyName: reg.companyName,
        coordinatorEmail: reg.coordinatorEmail,
        jobDetails: reg.jobDetails,
        workPeriod: reg.workPeriod,
        trainingDate: reg.trainingDate.toLocaleDateString('th-TH'),
        workType: reg.workType,
        contractorNames: reg.contractorNames,
        equipmentList: reg.equipmentList,
        status: reg.status,
        rejectReason: reg.rejectReason || "-",
        createdAt: reg.createdAt.toLocaleString('th-TH'),
      });
    });

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="contractor_registrations.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
