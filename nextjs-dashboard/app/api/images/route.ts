import { readdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const uploadPath = path.join(
    process.cwd(),
    "public/uploads"
  );

  const files = await readdir(uploadPath);

  const images = files.map((filename) => ({
    filename,
    url: `/uploads/${filename}`,
  }));

  return Response.json({
    images,
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return Response.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;

  const uploadPath = path.join(
    process.cwd(),
    "public/uploads",
    filename
  );

  await writeFile(uploadPath, buffer);

  return Response.json({
    filename,
    url: `/uploads/${filename}`,
  });
}