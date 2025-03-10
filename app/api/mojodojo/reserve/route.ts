import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "lib/prisma";

import z from "zod";

const schema = z.object({
    start_time: z.string(),
    end_time: z.string(),
    purpose: z.string().min(1, "purpose can not be empty"),
})

export async function POST(
    request: Request,
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    try {
        const params = schema.parse(await request.json())

        const start_time = new Date(params.start_time)
        const end_time = new Date(params.end_time)

        if (start_time >= end_time) {
            return NextResponse.json({ error: "start_time can not be gte end_time" }, { status: 422 })
        }

        if (end_time.getTime() - start_time.getTime() > 1000 * 60 * 60 * 2) { // cannot exceed 2 hours
            return NextResponse.json({ error: "以兩小時為限" }, { status: 422 })
        }


        if (start_time >= end_time) {
            return NextResponse.json({ error: "start_time can not be gte end_time" }, { status: 422 })
        }

        const result = await prisma.reserve.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                startedAt: {
                                    lte: start_time,
                                }
                            }, {
                                endedAt: {
                                    gte: start_time
                                }
                            }, {
                                room: {
                                    equals: 'MOJODOJO'
                                }
                            }
                        ]
                    }, {
                        AND: [
                            {
                                startedAt: {
                                    lte: end_time
                                }
                            }, {
                                endedAt: {
                                    gte: end_time,
                                }
                            }, {
                                room: {
                                    equals: 'MOJODOJO'
                                }
                            }
                        ]
                    }, {
                        AND: [
                            {
                                startedAt: {
                                    gte: start_time
                                }
                            },
                            {
                                endedAt: {
                                    lte: end_time
                                }
                            }, {
                                room: {
                                    equals: 'MOJODOJO'
                                }
                            }
                        ]
                    }
                ]
            }
        })

        if (result.length !== 0) {
            return NextResponse.json({ error: "Event Existed" }, { status: 401 });
        }

        const res = await prisma.reserve.create({
            data: {
                // userId: person?.accounts[0].providerAccountId as string,
                purpose: params.purpose,
                startedAt: start_time,
                room: 'MOJODOJO',
                endedAt: end_time,
                interval: (((end_time.getDate() * 24 + end_time.getHours()) * 60) + end_time.getMinutes()) - ((start_time.getDate() * 24 + start_time.getHours()) * 60 + start_time.getMinutes()),
                user: {
                    connect: {
                        email: session.user?.email as string
                    }
                }
            }
        })
        // console.log("final")
        return NextResponse.json({ message: "good" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log(error.errors)
            if (error.errors.map(e => e.message).includes("purpose can not be empty")) {
                return NextResponse.json({ error: "原因必填" }, { status: 422 })
            } else if (error.errors.map(e => e.message).includes("start_time can not be gte end_time")) {
                return NextResponse.json({ error: "起始時間必須小於結束時間" }, { status: 422 })
            } else if (error.errors.map(e => e.message).includes("exceed 2 hours")) {
                return NextResponse.json({ error: "租借以二小時為限" }, { status: 422 })
            }
            return NextResponse.json({ error: error.errors }, { status: 422 })
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}