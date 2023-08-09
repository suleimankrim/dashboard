import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthorized", { status: 401 });
    const body = await req.json();
    const { name, value } = body;
    if (!name)
      return new NextResponse("you should provide name", { status: 400 });
    if (!value)
      return new NextResponse("you should provide value", { status: 400 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    const color = await db.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(color);
  } catch (e) {
    return new NextResponse("[Color Create]" + e, { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const color = await db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(color);
  } catch (e) {
    return new NextResponse("[color Get]" + e, { status: 500 });
  }
}
