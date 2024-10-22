import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { encrypt, decrypt } from "./crypt";

export async function login(formData: FormData) {
  const user = {
    name: "Mom",
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const expires = new Date(Date.now() + 5 * 1000); 
  const accessToken = await encrypt({ email: user.email }, "5s");
  const refreshToken = await encrypt({ email: user.email }, "10m");


  cookies().set("accessToken", accessToken, { httpOnly: true, expires });
  cookies().set("refreshToken", refreshToken, { httpOnly: true });

  return { accessToken, refreshToken };
}

export async function logout() {
  cookies().set("accessToken", "", { expires: new Date(0) });
  cookies().set("refreshToken", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("refreshToken")?.value;
  if (!session) return null;

  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = cookies().get("refreshToken")?.value;
  if (!session) return null;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "accessToken",
    value: await encrypt(parsed, "10s"),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
