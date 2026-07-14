import Image from "next/image";

type ImageData = {
  filename: string;
  url: string;
};

type ImageGridProps = {
  images: ImageData[];
};

export default function ImageGrid({
  images,
}: ImageGridProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.filename}
          className="overflow-hidden rounded-lg border bg-white shadow-sm"
        >
          <Image
            src={image.url}
            alt={image.filename}
            width={400}
            height={400}
            className="h-64 w-full object-cover"
          />

          <div className="p-4">
            <p className="truncate text-sm text-gray-600">
              {image.filename}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}