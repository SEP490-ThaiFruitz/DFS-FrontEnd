"use client";
import React, { useState } from "react";
import FormAddress from "./form-address";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CirclePlusIcon, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAddresses, deleteAddress } from "@/actions/address";
import { ApiResponse, PageResult } from "@/types/types";
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog";
import { AddressTypes } from "@/types/address.types";

function AddressTab() {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [address, setAddress] = useState<AddressTypes | undefined>(undefined);
  const [isDeleteDialog, setIsDeleteDialog] = useState<boolean>(false);
  const [addressDelete, setAddressDelete] = useState<
    { id: string; name: string } | undefined
  >(undefined);

  const { isPending, data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      try {
        const response = await getAddresses();
        if (response?.isSuccess) {
          const data: ApiResponse<PageResult<AddressTypes>> = response.data;
          return data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] rounded-lg border bg-card"
    >
      <ResizablePanel defaultSize={70} minSize={30} className="p-4">
        <div className="m-5 grid sm:grid-cols-3 gap-6">
          {addresses?.value?.items.map((item: AddressTypes) => (
            <button
              key={item.id}
              onClick={() => {
                setIsCreate(false);
                setAddress(item);
              }}
              className={`relative group text-left border shadow-sm rounded-xl p-2 hover:cursor-pointer ${
                item.id == address?.id ? "border-purple-700" : ""
              }`}
            >
              {item.isDefault ? (
                <div className="flex justify-between">
                  <h3 className="font-bold mb-3">{item.tagName}</h3>
                  <p className="h-5 w-5 bg-purple-500 rounded-full" />
                </div>
              ) : (
                <h3 className="font-bold mb-3">{item.tagName}</h3>
              )}
              <span className="line-clamp-3 whitespace-pre-line">
                {item.receiverAddress}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialog(true);
                  setAddressDelete({
                    id: item.id,
                    name: item.tagName,
                  });
                }}
                className="absolute hidden group-hover:flex -top-3 -right-3 p-1 w-fit rounded-md bg-red-600 text-white cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </button>
          ))}
          <button
            className={`text-left border shadow-sm rounded-xl p-2 hover:cursor-pointer`}
            onClick={() => {
              setIsCreate(true);
              setAddress(undefined);
            }}
          >
            <div className="flex items-center p-5 space-x-5 font-bold">
              <CirclePlusIcon />
              <span>Thêm mới</span>
            </div>
          </button>
        </div>
      </ResizablePanel>

      {address && !isCreate && (
        <FormAddress onClose={() => setAddress(undefined)} address={address} />
      )}
      {isCreate && address === undefined && (
        <FormAddress onClose={() => setIsCreate(false)} address={undefined} />
      )}
      {addressDelete && (
        <DeleteDialog
          deleteFunction={deleteAddress}
          name={addressDelete.name}
          isOpen={isDeleteDialog}
          onClose={() => {
            setAddressDelete(undefined);
            setIsDeleteDialog(false);
          }}
          id={addressDelete.id}
          refreshKey={[["addresses"]]}
        />
      )}
    </ResizablePanelGroup>
  );
}

export default AddressTab;
