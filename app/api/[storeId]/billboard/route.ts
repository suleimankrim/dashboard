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
    const { label, imageUrl } = body;
    if (!label)
      return new NextResponse("you should provide name", { status: 400 });
    if (!imageUrl)
      return new NextResponse("you should provide name", { status: 400 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (e) {
    return new NextResponse("[Billboard Create]" + e, { status: 500 });
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
    const billboard = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (e) {
    return new NextResponse("[Billboard Get]" + e, { status: 500 });
  }
}
