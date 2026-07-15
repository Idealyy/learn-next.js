"use client";

import ImageGrid from "@/app/features/upload/image-grid";
import UploadForm from "@/app/features/upload/upload-form";
import { useImages } from "@/app/lib/hooks/use-images";

export default function UploadPage() {
  const {
    data,
    isLoading,
    error,
  } = useImages();


  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur</p>;
  }


  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Upload Image
      </h1>

      <UploadForm />

      <ImageGrid images={data.images} />
    </div>
  );
}