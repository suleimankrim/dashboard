import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: {
      sizeId: string;
    };
  }
) {
  try {
    if (!params.sizeId) return new NextResponse("size Id", { status: 422 });
    const size = await db.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (e) {
    return new NextResponse("[size GET]" + e, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      sizeId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.sizeId) return new NextResponse("size Id", { status: 422 });
    const { name, value } = await req.json();
    if (!name) return new NextResponse("should provide name", { status: 422 });
    if (!value)
      return new NextResponse("should provide value", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    const size = await db.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (e) {
    return new NextResponse("[Size Update]" + e, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      sizeId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.sizeId) return new NextResponse("size Id", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    await db.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return new NextResponse("ok");
  } catch (e) {
    return new NextResponse("[size Delete]" + e, { status: 500 });
  }
}
