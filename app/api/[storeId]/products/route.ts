import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductSchema } from "@/lib/validation";

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
    const {
      name,
      colorId,
      image,
      isArchived,
      isFeatured,
      sizeId,
      price,
      categoryId,
    } = ProductSchema.parse(body);
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    const product = await db.product.create({
      data: {
        name,
        colorId,
        price,
        isArchived: isArchived ?? false,
        isFeatured: isFeatured ?? false,
        sizeId,
        categoryId,
        storeId: params.storeId,
        image: {
          createMany: {
            data: [...image.map((imag: { url: string }) => imag)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    return new NextResponse("[Product Create]" + e, { status: 500 });
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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const product = await db.product.findMany({
      where: {
        storeId: params.storeId,
        colorId,
        sizeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        image: true,
        Category: true,
        Color: true,
        Size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    return new NextResponse("[Product Get]" + e, { status: 500 });
  }
}
