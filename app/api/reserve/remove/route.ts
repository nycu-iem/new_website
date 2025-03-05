export const runtime = "edge";

import { NextResponse } from "next/server";

import { prisma } from "lib/prisma";
import { auth } from "@/app/auth";

export async function POST(
    request: Request,
) {
    // start verification
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const data: {
        id: string,
    } = await request.json();

    if (!data.id) {
        return NextResponse.json({ message: "wrong params" }, { status: 422 });
    }
    // verify owner

    // console.log(session.user.student_id)
    // console.log(data.id)

    const verify = await prisma.reserve.findMany({
        where: {
            AND: {
                id: { equals: data.id },
                user: {
                    student_id: { equals: session.user.student_id }
                }
            }
        }
    })


    if (verify.length === 0) {
        return NextResponse.json({ message: 'Bad Guy Go Away' }, { status: 403 });
    }

    if (isTodayOrBefore(verify[0].startedAt) && isTodayOrBefore(verify[0].endedAt)) {
        return NextResponse.json({ message: '不得刪除今天或之前的活動' }, { status: 403 });
    }
    // delete reserve

    const deleteReserve = await prisma.reserve.deleteMany({
        where: {
            AND: {
                id: { equals: data.id },
                user: {
                    student_id: { equals: session.user.student_id }
                }
            }
        }
    })

    return NextResponse.json({ message: "good" });
}


const isTodayOrBefore = (time: Date) => {
    const now = new Date();

    if (time.getFullYear() <= now.getFullYear()) {
        if (time.getMonth() <= now.getMonth()) {
            if (time.getDate() <= now.getDate()) {
                return true
            }
        }
    }

    return false
}