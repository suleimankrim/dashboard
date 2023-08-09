import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
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
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    const body = await req.json();
    if (!body.name)
      return new NextResponse("should provide name", { status: 422 });
    const store = await db.store.updateMany({
      where: {
        userId,
        id: params.storeId,
      },
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(store);
  } catch (e) {
    return new NextResponse("[Store Update]" + e, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
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
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    await db.store.deleteMany({
      where: {
        userId,
        id: params.storeId,
      },
    });
    return new NextResponse("ok");
  } catch (e) {
    return new NextResponse("[Store Delete]" + e, { status: 500 });
  }
}
