import { NextResponse } from "next/server";
import { getChangeLogImageSrc } from "lib/api"

export async function GET(
    request: Request,
    context: {
        params: Promise<{
            blockId: string
        }>
    }
) {
    const p = await context.params
    const blockId = p.blockId

    const imageSrc = await getChangeLogImageSrc(blockId);

    return NextResponse.json({ imageSrc });
}