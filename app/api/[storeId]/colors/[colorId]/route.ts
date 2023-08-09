import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: {
      colorId: string;
    };
  }
) {
  try {
    if (!params.colorId) return new NextResponse("color Id", { status: 422 });
    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (e) {
    return new NextResponse("[color GET]" + e, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      colorId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.colorId) return new NextResponse("color Id", { status: 422 });
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
    const color = await db.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (e) {
    return new NextResponse("[Color Update]" + e, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      colorId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.colorId) return new NextResponse("color Id", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    await db.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });
    return new NextResponse("ok");
  } catch (e) {
    return new NextResponse("[color Delete]" + e, { status: 500 });
  }
}
