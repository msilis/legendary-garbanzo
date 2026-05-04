import type { R2Bucket, EventContext } from "@cloudflare/workers-types";

interface Env {
  BUCKET: R2Bucket;
  FAMILY_PIN: string;
}

export const onRequestPost = async (
  context: EventContext<Env, any, Record<string, unknown>>,
) => {
  const { request, env } = context;

  const formData = await request.formData();
  const pin = formData.get("pin");

  if (pin !== env.FAMILY_PIN) {
    return new Response("Invalid pin", { status: 401 });
  }

  const file = formData.get("video") as File | null;
  if (!file || !(file instanceof File)) {
    return new Response("No video file provided", { status: 400 });
  }

  const title = (formData.get("title") as string) || file.name;
  const who = formData.get("who") as string;

  const key = `animations/${Date.now()}-${file.name}`;

  // @ts-ignore - DOM ReadableStream is compatible at runtime
  await env.BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      title,
      who,
      uploadedAt: new Date().toISOString(),
    },
  });

  return new Response(`Uploaded ${key}`, { status: 200 });
};
