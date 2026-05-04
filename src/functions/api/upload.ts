import type { R2Bucket, ReadableStream } from "@cloudflare/workers-types";

interface Env {
  BUCKET: R2Bucket;
  FAMILY_PIN: string;
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/upload" && request.method === "POST") {
      const formData = await request.formData();
      const pin = formData.get("pin");

      if (pin !== env.FAMILY_PIN) {
        return new Response("Invalid pin", { status: 401 });
      }
      const file = formData.get("video") as File;
      const title = formData.get("title");
      const who = formData.get("who");

      const key = `animations/${Date.now()}-${file?.name}`;

      // @ts-ignore - DOM ReadableStream is compatible at runtime
      await env.BUCKET.put(key, file?.stream(), {
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
    }
    return new Response("Invalid request", { status: 400 });
  },
};
