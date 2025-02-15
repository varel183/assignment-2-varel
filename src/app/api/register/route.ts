import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  const userCookies = await cookies();
  userCookies.set("user", JSON.stringify({ username, email }));

  return NextResponse.json({ message: "Registrasi berhasil!" });
}
