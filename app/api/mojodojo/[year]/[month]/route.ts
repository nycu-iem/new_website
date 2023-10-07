import { NextResponse } from 'next/server'
import { prisma } from "lib/prisma"

export async function GET(request: Request, { params }: { params: { year: string, month: string } }) {
    try {
        const days = await getMojoDojoReserve({
            month: params.month,
            year: params.year
        })
        return NextResponse.json(days)
    } catch (err) {
        return NextResponse.json({ message: 'fuck you' })
    }
}

export const getMojoDojoReserve = async ({
    month,
    year,
}: {
    year: string,
    month: string
}) => {
    const startTimeOfTheMonth = new Date(parseInt(year), parseInt(month) - 1, -1);
    const endTimeOfTheMonth = new Date(parseInt(year), parseInt(month));

    const days = await prisma.reserve.findMany({
        where: {
            AND: {
                startedAt: {
                    // gte, lte
                    gte: startTimeOfTheMonth,
                    lte: endTimeOfTheMonth,
                },
                OR: [
                    { room: { equals: 'MOJODOJO' } },
                    { room: null }
                ]
            }
        }, select: {
            startedAt: true,
            endedAt: true,
            purpose: true,
            user: {
                select: {
                    student_id: true,
                    name: true,
                }
            }
        }
    })

    return days;
}