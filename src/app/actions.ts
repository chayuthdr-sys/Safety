"use server";

import { prisma } from "@/lib/prisma";
import { uploadFileToMinIO } from "@/lib/minio";
import { revalidatePath } from "next/cache";

export async function submitRegistration(formData: FormData) {
  try {
    const companyName = formData.get("companyName") as string;
    const coordinatorEmail = formData.get("coordinatorEmail") as string;
    const jobDetails = formData.get("jobDetails") as string;
    const workPeriod = formData.get("workPeriod") as string;
    const contractorNames = formData.get("contractorNames") as string;
    const equipmentList = formData.get("equipmentList") as string;
    const trainingDateStr = formData.get("trainingDate") as string;
    const workType = formData.get("workType") as string;

    const trainingDate = new Date(trainingDateStr);

    // Mandatory Files
    const idCardFile = formData.get("idCard") as File;
    const socialSecurityFile = formData.get("socialSecurity") as File;

    const idCardPdfPath = await uploadFileToMinIO(idCardFile) || "";
    const socialSecurityPdfPath = await uploadFileToMinIO(socialSecurityFile) || "";

    // Conditional Files
    let craneDoc1Path = null;
    let craneCertPath = null;
    let cranePlanPath = null;
    
    if (workType === "งานยกโดยใช้ปั้นจั่น") {
      craneDoc1Path = await uploadFileToMinIO(formData.get("craneDoc1") as File);
      craneCertPath = await uploadFileToMinIO(formData.get("craneCert") as File);
      cranePlanPath = await uploadFileToMinIO(formData.get("cranePlan") as File);
    }

    let confinedHealthCheckPath = null;
    let confinedCertPath = null;

    if (workType === "งานที่อับอากาศ") {
      confinedHealthCheckPath = await uploadFileToMinIO(formData.get("confinedHealth") as File);
      confinedCertPath = await uploadFileToMinIO(formData.get("confinedCert") as File);
    }

    const registration = await prisma.registration.create({
      data: {
        companyName,
        coordinatorEmail,
        jobDetails,
        workPeriod,
        contractorNames,
        equipmentList,
        trainingDate,
        workType,
        idCardPdfPath,
        socialSecurityPdfPath,
        craneDoc1Path,
        craneCertPath,
        cranePlanPath,
        confinedHealthCheckPath,
        confinedCertPath,
        status: "รอดำเนินการ",
      },
    });

    revalidatePath("/admin");
    return { success: true, data: registration };
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
}

export async function updateRegistrationStatus(id: number, status: string, rejectReason?: string) {
  try {
    const updated = await prisma.registration.update({
      where: { id },
      data: {
        status,
        rejectReason: status === "ตีกลับ" ? rejectReason : null,
      },
    });
    revalidatePath("/admin");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" };
  }
}

export async function getRegistrationById(id: number) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        trainingDate: true,
        status: true,
        rejectReason: true,
        createdAt: true,
        workType: true,
      }
    });
    
    if (!registration) {
      return { success: false, error: "ไม่พบข้อมูลคำร้องนี้" };
    }

    return { success: true, data: registration };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการดึงข้อมูล" };
  }
}
