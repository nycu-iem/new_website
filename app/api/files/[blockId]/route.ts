import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { notion } from "../../../../lib/notion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

/*  There is two places that website need to get notion files
    1. displaying the file => every logged in account
    2. downloading the file => premium
    
 */

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

    // use prisma to confirm whether the student paid union_fee
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log('not logged in')
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const result = await notion.getBlock({ blockId });
        console.log(result)

        const file = await (await fetch('url')).blob()

        const headers = new Headers();
        
        headers.set("Content-Type", "application/pdf");

        return new NextResponse(file, { status: 200, statusText: "OK", headers })
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            message: err
        });
    }

    return NextResponse.json({
        // imageSrc
    });
}