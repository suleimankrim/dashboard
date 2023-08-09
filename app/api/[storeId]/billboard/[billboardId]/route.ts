import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: {
      billboardId: string;
    };
  }
) {
  try {
    if (!params.billboardId)
      return new NextResponse("product Id", { status: 422 });
    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (e) {
    return new NextResponse("[Billboard GET]" + e, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.billboardId)
      return new NextResponse("product Id", { status: 422 });
    const { label, imageUrl } = await req.json();
    if (!label)
      return new NextResponse("should provide label", { status: 422 });
    if (!imageUrl)
      return new NextResponse("should provide imageUrl", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    const store = await db.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(store);
  } catch (e) {
    return new NextResponse("[Billboard Update]" + e, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.billboardId)
      return new NextResponse("product Id", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    await db.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return new NextResponse("ok");
  } catch (e) {
    return new NextResponse("[Billboard Delete]" + e, { status: 500 });
  }
}
