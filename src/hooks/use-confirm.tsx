"use client";

import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import JSX from "react";

export const useConfirm = (
  title: string,
  message: string,
  isPending?: boolean
): [() => JSX.ReactElement, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  const wait = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const refOutside = useRef<HTMLDivElement>(null);

  const confirm = () => {
    wait(700);
    return new Promise((resolve, reject) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
    setLoading(false); //
  };

  const handleConfirm = async () => {
    setLoading(true); // Set loading when confirmed
    await wait(200);
    promise?.resolve(true);
    setLoading(false); // Set loading when confirmed
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  useClickAway(refOutside, handleClose);

  useEffect(() => {
    return () => handleClose();
  }, []);

  const ConfirmDialog = () => {
    return (
      <Dialog open={promise != null}>
        <DialogContent ref={refOutside}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <ButtonCustomized
              variant="outline"
              onClick={handleCancel}
              className="w-24 bg-slate-50 hover:bg-slate-100 transition duration-200 text-slate-800"
              disabled={loading}
              label={"Hủy"}
            />
            {/* </ButtonCustomized> */}
            {/* <Button
              // variant="moiMoc"
              onClick={handleConfirm}
              className="w-28"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                </>
              ) : (
                "Confirm"
              )}
            </Button> */}

            <ButtonCustomized
              type="submit"
              className="w-fit bg-sky-500 hover:bg-sky-700"
              variant="secondary"
              onClick={handleConfirm}
              disabled={loading}
              label={
                loading ? (
                  <WaitingSpinner
                    variant="pinwheel"
                    label="Vui lòng đợi..."
                    className="font-semibold "
                    classNameLabel="font-semibold text-sm"
                  />
                ) : (
                  "Xác nhận"
                )
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmDialog, confirm];
};
