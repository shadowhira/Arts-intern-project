import { NextRequest } from "next/server";
import { updateSession } from "./lib/handleLogin";

export async function middleware(request: NextRequest) {
    console.log(request)
    await updateSession(request);
}