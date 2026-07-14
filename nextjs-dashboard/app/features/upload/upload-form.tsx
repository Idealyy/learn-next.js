"use client";

import { useCallback, useRef, useState } from "react";
import { useUploadImage } from "@/app/lib/hooks/use-upload-image";

const MAX_SIZE_MB = 8;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function UploadFormT() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImage();

  const isBusy = uploadMutation.isPending;

  function validateAndSetFile(file: File | undefined | null) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setValidationError("Format non supporté (PNG, JPG, WEBP ou GIF uniquement)");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`Fichier trop lourd (max ${MAX_SIZE_MB} Mo)`);
      return;
    }

    setValidationError(null);
    uploadMutation.reset();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    validateAndSetFile(event.target.files?.[0]);
    event.target.value = "";
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      if (isBusy) return;
      validateAndSetFile(e.dataTransfer.files?.[0]);
    },
    [isBusy]
  );

  function clearSelection() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    uploadMutation.reset();
  }

  function handleUpload() {
    if (!selectedFile) return;

    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        setPreviewUrl(null);
      },
    });
  }

  return (
    <div className="mb-8 w-full max-w-md">
      {/* Dropzone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isBusy && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        aria-label="Zone de dépôt d'image"
        className={[
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-150 cursor-pointer select-none",
          isBusy ? "cursor-not-allowed opacity-60" : "",
          isDragging
            ? "border-black bg-gray-50 scale-[1.01]"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          disabled={isBusy}
          className="sr-only"
        />

        {previewUrl ? (
          <div className="flex w-full flex-col items-center gap-3">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="h-48 w-48 rounded-xl object-cover shadow-sm ring-1 ring-black/5"
            />
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="max-w-[220px] truncate">{selectedFile.name}</span>
                <span className="text-gray-400">·</span>
                <span>{formatBytes(selectedFile.size)}</span>
              </div>
            )}
            {!isBusy && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
              >
                Choisir une autre image
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={[
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                isDragging ? "bg-black text-white" : "bg-gray-100 text-gray-500",
              ].join(" ")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
                <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragging ? "Déposez l'image ici" : "Glissez une image ici"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                ou cliquez pour parcourir — PNG, JPG, WEBP jusqu à {MAX_SIZE_MB} Mo
              </p>
            </div>
          </>
        )}
      </div>

      {validationError && (
        <p className="mt-2 text-sm text-red-600">{validationError}</p>
      )}

      {/* Action */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isBusy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isBusy && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {isBusy ? "Envoi en cours…" : "Envoyer l'image"}
      </button>

      {uploadMutation.isSuccess && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-green-600">
          <span className="text-base">✓</span> Upload terminé !
        </p>
      )}

      {uploadMutation.isError && (
        <p className="mt-3 text-sm text-red-600">
          Erreur pendant lupload. Réessayez.
        </p>
      )}
    </div>
  );
}