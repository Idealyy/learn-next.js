import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { uploadImage } from "../images";

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadImage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
    },
  });
}