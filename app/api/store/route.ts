import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthorized", { status: 401 });
    const body = await req.json();
    const { name } = body;
    if (!name)
      return new NextResponse("you should provide name", { status: 400 });
    const existName = await db.store.findFirst({
      where: {
        name,
      },
    });
    if (existName)
      return new NextResponse("name is already exist", { status: 409 });
    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (e) {
    return new NextResponse("[Store Create]" + e, { status: 500 });
  }
}
