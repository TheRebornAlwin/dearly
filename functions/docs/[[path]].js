// The docs/ folder is for the GitHub repo only. Keep it off the public website.
export const onRequest = () => new Response("Not found", { status: 404, headers: { "content-type": "text/plain", "x-robots-tag": "noindex" } });
