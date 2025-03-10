
import { NextResponse } from 'next/server'
import { getCasaHouseReserve } from '@/lib/api'

export async function GET(request: Request, { params }: { params: Promise<{ year: string, month: string }> }) {
    const p = await params
    
    try {
        const days = await getCasaHouseReserve({
            month: p.month,
            year: p.year
        })
        return NextResponse.json(days)
    } catch (err) {
        return NextResponse.json({ message: 'fuck you' })
    }

}