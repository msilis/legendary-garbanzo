import type { R2Bucket, EventContext } from "@cloudflare/workers-types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface Env {
  BUCKET: R2Bucket;
  FAMILY_PIN: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ACCOUNT_ID: string;
}

interface UploadRequest {
  title: string;
  who: string;
  file: File;
  contentType: string;
  pin: string;
}

export const onRequestPost = async (
  context: EventContext<Env, any, Record<string, unknown>>,
) => {
  const { request, env } = context;

  const formData = await request.formData();

  const { title, who, file, contentType, pin } =
    (await request.json()) as UploadRequest;

  if (pin !== env.FAMILY_PIN) {
    return new Response("Invalid pin", { status: 401 });
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  const key = `animations/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: "august-archie",
    Key: key,
    Body: file.stream(),
    ContentType: file.type,
    Metadata: {
      title,
      who,
      uploadedAt: new Date().toISOString(),
    },
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return new Response(JSON.stringify({ url, key }), {
    headers: {
      ContentType: "application/json",
    },
  });
};
