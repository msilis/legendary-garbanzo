import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

if (!process.env.CLOUDFLARE_URL) {
  throw new Error("CLOUDFLARE_URL environment variable is not set");
}

if (!process.env.CLOUDFLARE_ACCESS_KEY_ID) {
  throw new Error("CLOUDFLARE_ACCESS_KEY_ID environment variable is not set");
}

if (!process.env.CLOUDFLARE_SECRET_ACCESS_KEY) {
  throw new Error(
    "CLOUDFLARE_SECRET_ACCESS_KEY environment variable is not set",
  );
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_URL,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(
  file: File,
  key: string,
  metadata: Record<string, string>,
) {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: key,
    Body: file.stream(),
    ContentType: file.type,
    Metadata: metadata,
  });

  await r2Client.send(command);

  return {
    url: `${process.env.CLOUDFLARE_URL}/${key}`,
    key: key,
  };
}
