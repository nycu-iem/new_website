import { NextResponse } from "next/server";
import { getChangeLogImageSrc } from "lib/api"

export async function GET(
    request: Request,
    context: {
        params: {
            blockId: string
        }
    }
) {
    const blockId = context.params.blockId

    const imageSrc = await getChangeLogImageSrc(blockId);

    return NextResponse.json({ imageSrc });
}