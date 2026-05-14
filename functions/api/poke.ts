export const onRequestGet = async ({ env }) => {
  await env.BUCKET.list({ limit: 1 });
  return new Response("Poked");
};
