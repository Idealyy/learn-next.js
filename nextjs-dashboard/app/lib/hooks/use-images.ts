import { useQuery } from "@tanstack/react-query";
import { getImages } from "../images";

export function useImages() {
  return useQuery({
    queryKey: ["images"],
    queryFn: getImages,
  });
}