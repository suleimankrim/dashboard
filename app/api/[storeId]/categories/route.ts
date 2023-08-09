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
    const { name, billboardId } = body;
    if (!name)
      return new NextResponse("you should provide name", { status: 400 });
    if (!billboardId)
      return new NextResponse("you should provide name", { status: 400 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(category);
  } catch (e) {
    return new NextResponse("[category Create]" + e, { status: 500 });
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
    const category = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(category);
  } catch (e) {
    return new NextResponse("[category Get]" + e, { status: 500 });
  }
}
