// app/api/generate-image/route.js
import Replicate from "replicate";

export async function POST(request) {
  const { prompt } = await request.json();

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const output = await replicate.run(
    "black-forest-labs/flux-schnell",
    { input: { prompt } }
  );

  return Response.json({ imageUrl: output[0] });
}
