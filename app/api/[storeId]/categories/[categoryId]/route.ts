import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: {
      categoryId: string;
    };
  }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("category Id", { status: 422 });
    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        Billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (e) {
    return new NextResponse("[category GET]" + e, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      categoryId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.categoryId)
      return new NextResponse("category Id", { status: 422 });
    const { name, billboardId } = await req.json();
    if (!name) return new NextResponse("should provide name", { status: 422 });
    if (!billboardId)
      return new NextResponse("should provide productId", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    const category = await db.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (e) {
    return new NextResponse("[category Update]" + e, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      categoryId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.categoryId)
      return new NextResponse("category Id", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    await db.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return new NextResponse("ok category");
  } catch (e) {
    return new NextResponse("[category Delete]" + e, { status: 500 });
  }
}
