"use client";

import { useImages } from "@/app/lib/hooks/use-images";
import ImageGrid from "../../features/upload/image-grid";
import UploadForm from "../../features/upload/upload-form";

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