import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductSchema } from "@/lib/validation";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: {
      productId: string;
    };
  }
) {
  try {
    if (!params.productId)
      return new NextResponse("product Id", { status: 422 });
    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        Size: true,
        Color: true,
        Category: true,
        image: true,
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    return new NextResponse("[product GET]" + e, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      productId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.productId)
      return new NextResponse("product Id", { status: 422 });
    if (!params.productId)
      return new NextResponse("product Id", { status: 422 });
    const body = await req.json();
    const {
      isFeatured,
      image,
      price,
      sizeId,
      colorId,
      name,
      categoryId,
      isArchived,
    } = ProductSchema.parse(body);
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        categoryId,
        sizeId,
        colorId,
        name,
        price,
        isArchived,
        isFeatured,
        image: {
          deleteMany: {},
        },
      },
    });
    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        image: {
          createMany: {
            data: [...image.map((im: { url: string }) => im)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    return new NextResponse("[product Update]" + e, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      productId: string;
    };
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("authorization", { status: 401 });
    if (!params.storeId) return new NextResponse("store Id", { status: 422 });
    if (!params.productId)
      return new NextResponse("product Id", { status: 422 });
    const existStoreWithUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!existStoreWithUser)
      return new NextResponse("unauthorized", { status: 403 });
    await db.product.deleteMany({
      where: {
        id: params.productId,
      },
    });
    return new NextResponse("ok");
  } catch (e) {
    return new NextResponse("[Product Delete]" + e, { status: 500 });
  }
}
