import { jwtDecode } from "jwt-decode";
import { getToken } from "./client/interact-api";
import { redirect } from "next/navigation";

export type DecodeData = {
  Id: string;
  Name: string;
  Email: string;
  Role: string;
  exp: number;
  iss: string;
  aud: string;
};

export enum ROLES {
  Administrator = "Administrator",
  Staff = "Staff",
  Manager = "Manager",
  Customer = "Customer",
}
export const checkRole = async (role: string) => {
  const token: any = await getToken();

  // console.log({ tokenAdminLayout: token });

  if (!token?.accessToken) {
    return null;
  }

  try {
    const decode: DecodeData = jwtDecode<DecodeData>(token?.accessToken);

    return decode.Role.toUpperCase() === role.toUpperCase();
  } catch (error) {
    console.log({ error });
  }
};
