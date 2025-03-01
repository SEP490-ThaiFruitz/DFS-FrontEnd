"use client";

import { MoveLeft } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FormSendForgetPassword } from "./form-send-forget-password";
import { FormVerify } from "./form-verify-forget-password";
import { FormUpdateNewForgetPassword } from "./form-update-new-password";
import { useState } from "react";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { useForgetPasswordDialog } from "@/hooks/use-forget-password-dialog";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";

export type TabType = "send" | "verify" | "new";

export interface UserForgetPassword {
    email: string | undefined,
    phone: string | undefined,
    otp: string
}


export const FormForgetPassword = () => {
    const forgetPasswordDialog = useForgetPasswordDialog();
    const [tab, setTab] = useState<TabType>("send")
    const [user, setUser] = useState<UserForgetPassword>({
        email: undefined,
        phone: undefined,
        otp: ""
    })

    const handlerSetUser = (user: UserForgetPassword, nameTab: TabType) => {
        setUser(user)
        setTab(nameTab)
    }

    const title = (
        <div className="text-center flex items-center">
            <button onClick={() => handlerBackForm()} className="p-1 rounded-full hover:cursor-pointer hover:bg-slate-200">
                <MoveLeft />
            </button>
            <h3 className="w-full mr-5">Quên mật khẩu</h3>
        </div>
    )

    const retunrButton = (
        <ButtonCustomized
            onClick={() => handlerBackForm()}
            type="button"
            className="w-32 !h-10 bg-slate-100 text-slate-900 hover:bg-slate-300"
            variant="outline"
            label="Quay lại"
        />
    )

    const handlerBackForm = () => {
        switch (tab) {
            case "verify":
                setTab("send");
                break;
            case "new":
                setTab("verify");
                break;
            default:
                forgetPasswordDialog.onClose();
                break;
        }
    };

    const handlerUpdateSuccess = () => {
        forgetPasswordDialog.onClose();
    }

    const body = (

        <Tabs onValueChange={(e) => setTab(e as TabType)} value={tab}>
            <TabsContent value="send">
                <FormSendForgetPassword returnButton={retunrButton} setUsername={handlerSetUser} />
            </TabsContent>
            <TabsContent value="verify">
                <FormVerify returnButton={retunrButton} user={user} setOtpValue={handlerSetUser} />
            </TabsContent>
            <TabsContent value="new">
                <FormUpdateNewForgetPassword handlerSucess={handlerUpdateSuccess} returnButton={retunrButton} user={user} />
            </TabsContent>
        </Tabs>

    )

    return (
        <DialogReused
            content={body}
            title={title}
            open={forgetPasswordDialog.isOpen}
            hiddenClose
            className="max-w-fit px-10"
        />
    );
};
