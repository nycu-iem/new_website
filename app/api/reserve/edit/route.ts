import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { prisma } from "lib/prisma";

export async function POST(
    request: Request,
) {
    // start verification
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const data: {
        id: string,
        new_title: string
    } = await request.json();

    if (!data.id && !data.new_title) {
        return NextResponse.json({ error: "wrong params" }, { status: 422 });
    }

    // verify owner

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
        return NextResponse.json({ message: 'Bad Guy Go Away' }, { status: 403 })
    }

    if (isTodayOrBefore(verify[0].startedAt) && isTodayOrBefore(verify[0].endedAt)) {
        return NextResponse.json({ message: "不得變更今天或之前的活動" }, { status: 403 })
    }

    const updatedReserve = await prisma.reserve.updateMany({
        where: {
            AND: {
                id: { equals: data.id },
                user: {
                    student_id: { equals: session.user.student_id }
                }
            }
        },
        data: {
            purpose: data.new_title
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