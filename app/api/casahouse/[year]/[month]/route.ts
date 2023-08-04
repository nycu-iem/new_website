import { NextResponse } from 'next/server'
import { prisma } from "../../../../../lib/prisma"

export async function GET(request: Request, { params }: { params: { year: string, month: string } }) {
    const startTimeOfTheMonth = new Date(parseInt(params.year), parseInt(params.month) - 1, -1);
    const endTimeOfTheMonth = new Date(parseInt(params.year), parseInt(params.month));

    const days = await prisma.reserves.findMany({
        where: {
            startedAt: {
                gte: startTimeOfTheMonth,
                lte: endTimeOfTheMonth,
            }
        }
    })
    console.log(days)

    return NextResponse.json(days)
}