"use client";

import { getProfile, updateProfile } from "@/actions/user";
import { ApiResponse, Profile } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, CircleCheckBig, CircleX } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Spinner } from "@/components/global-components/spinner";
import { formatNumberWithUnit } from "@/lib/format-currency";
import { USER_KEY } from "@/app/key/user-key";
import { placeholderImage } from "@/utils/label";

function ProfileAvatar() {
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<(File & { preview: string }) | null>(null);

  const queryClient = useQueryClient();
  //   const user = queryClient.getQueryData<Profile>(["authUser"]);

  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess,
    status,
  } = useQuery<ApiResponse<Profile>>({
    // queryKey: ["authUser"],
    queryKey: [USER_KEY.PROFILE],
    queryFn: async () => {
      const response = await getProfile();

      if (!response || !response.isSuccess || !response.data) {
        toast.error("Lỗi hệ thống");
        return undefined;
      }
      return response.data;
    },
  });

  const { mutate: updateImage, isPending } = useMutation({
    mutationFn: async () => {
      try {
        if (!file) throw new Error("File is required");

        const formData = new FormData();
        formData.append("avatar", file);

        const res = await updateProfile(formData);

        if (!res?.isSuccess) {
          throw new Error(res?.message);
        }
      } catch (error: any) {
        throw new Error(error?.message ?? "Lỗi hệ thống");
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật ảnh thành công");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: [USER_KEY.PROFILE] });
      setFile(null);
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  const handleClick = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  const handlerChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn ảnh");
        return;
      }
      setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
    }
  };

  return (
    <div className="text-center">
      <div className="relative w-40 h-40 mx-auto mb-4">
        <Image
          src={file?.preview ?? user?.value?.avatar ?? placeholderImage}
          alt={"avatar"}
          fill
          className="rounded-full object-cover border-4 border-purple-200"
        />
        <button
          disabled={isPending}
          className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors"
        >
          <Camera onClick={handleClick} className="h-5 w-5" />
          <input
            onChange={handlerChangeImage}
            multiple={false}
            accept={"image/jpeg, image/jpg, image/png, image/webp"}
            type="file"
            ref={imageRef}
            hidden
          />
        </button>
        {file && (
          <>
            <button
              disabled={isPending}
              onClick={async () => updateImage()}
              className="absolute bottom-0 -right-10 bg-green-500 hover:bg-green-700 rounded-full hover:cursor-pointer p-2 text-white"
            >
              {isPending ? (
                <Spinner className="h-5 w-5" />
              ) : (
                <CircleCheckBig className="h-5 w-5" />
              )}
            </button>
            <button
              disabled={isPending}
              onClick={() => setFile(null)}
              className="absolute bottom-0 -right-20 bg-rose-500 hover:bg-rose-700 rounded-full hover:cursor-pointer p-2 text-white"
            >
              <CircleX className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      <p className="text-2xl font-semibold mb-1 text-purple-700">
        {user?.value?.name}
      </p>
      <p className="text-xl font-semibold mb-1 text-purple-700">
        {formatNumberWithUnit(user?.value?.point ?? 0, "điểm")}
      </p>
    </div>
  );
}

export default ProfileAvatar;
