import type { R2Bucket, EventContext } from "@cloudflare/workers-types";

interface Env {
  BUCKET: R2Bucket;
  CLOUDFLARE_DEVELOPMENT_URL: string;
}

export const onRequestGet = async (
  context: EventContext<Env, any, Record<string, unknown>>,
) => {
  const { env } = context;

  const objects = await env.BUCKET.list({
    prefix: "animations/",
    include: ["customMetadata"],
  } as any);

  const videos = objects.objects.map((obj) => {
    return {
      key: obj.key,
      url: `${env.CLOUDFLARE_DEVELOPMENT_URL}/${obj.key}`,
      title: obj.customMetadata?.title || obj.key,
      who: obj.customMetadata?.who || "Unknown",
      uploadedAt: obj.customMetadata?.uploadedAt,
    };
  });

  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" },
  });
};
