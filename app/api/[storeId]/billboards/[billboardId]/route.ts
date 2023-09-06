import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { billboardId: string };
  }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required!", { status: 400 });
    }
    const billboard = await prismadb?.store.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; billboardId: string };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Name is required!", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image is required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required!", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required!", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb?.billboard.updateMany({
      where: {
        storeId: params.storeId,
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; billboardId: string };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required!", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required!", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb?.store.deleteMany({
      where: {
        id: params.billboardId,
        userId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}