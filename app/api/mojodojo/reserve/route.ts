import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "lib/prisma";

export async function POST(
    request: Request,
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const data: {
        start_time: Date,
        end_time: Date,
        purpose: string
    } = await request.json();

    if (!data.start_time && !data.end_time && !data.purpose) {
        return NextResponse.json({ error: "wrong params" }, { status: 422 });
    }

    const start_time = new Date(data.start_time)
    const end_time = new Date(data.end_time)

    if (start_time >= end_time) {
        return NextResponse.json({ error: "start_time can not be gte end_time" }, { status: 422 })
    }

    if (data.purpose === "") {
        return NextResponse.json({ error: "Purpose cannot be empty" }, { status: 422 })
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
            purpose: data.purpose,
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
}