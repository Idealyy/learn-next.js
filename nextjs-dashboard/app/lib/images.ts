// app/lib/images.ts

export async function getImages() {
  const response = await fetch("/api/images");

  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }

  return response.json();
}


export async function uploadImage(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("/api/images", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
}