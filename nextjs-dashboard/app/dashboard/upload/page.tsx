"use client";

import { useQuery } from "@tanstack/react-query";
import { getImages } from "@/app/lib/images";

export default function UploadPage() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["images"],
    queryFn: getImages,
  });

  if (isLoading) {
    return <p>Chargement des images...</p>;
  }

  if (error) {
    return <p>Erreur lors du chargement des images</p>;
  }

  return (
    <div>
      <h1>Upload Image</h1>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}