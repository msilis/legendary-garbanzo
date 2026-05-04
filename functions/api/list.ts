import type { R2Bucket } from "@cloudflare/workers-types";

interface Env {
  BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env) {
    const { BUCKET } = env;
    const files = await BUCKET.list();
    return new Response(JSON.stringify(files), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
