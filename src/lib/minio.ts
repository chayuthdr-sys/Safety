import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000", 10),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "admin",
  secretKey: process.env.MINIO_SECRET_KEY || "password1234",
});

const BUCKET_NAME = "contractor-docs";

export async function uploadFileToMinIO(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    // Check if bucket exists, if not, try to create it
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME).catch(() => false);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, "ap-southeast-1").catch(console.error);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      buffer,
      file.size,
      { "Content-Type": file.type || "application/octet-stream" }
    );

    // Return the path that can be used to construct URL
    return `/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to MinIO:", error);
    return null;
  }
}
