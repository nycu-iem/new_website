import { NextResponse } from "next/server";

import { prisma } from "lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
    request: Request,
) {
    try {
        const nominees = await prisma.nominee2024.findMany({
            select: {
                nominee: {
                    select: {
                        name: true,
                        student_id: true,
                    }
                },
                nomiatedBy: {
                    select: {
                        name: true,
                        student_id: true,
                    }
                },
                id: true
            }
        });

        const nominees_with_year = nominees.map((nominee) => ({
            nominatedBy: {
                name: nominee.nomiatedBy.name,
                year: `0${nominee.nomiatedBy.student_id.length === 9 ? parseInt(nominee.nomiatedBy.student_id.slice(1, 3)) + 4 : parseInt(nominee.nomiatedBy.student_id.slice(0, 2)) + 4}`.slice(-2)
            },
            nominee: {
                name: nominee.nominee.name,
                year: `0${nominee.nominee.student_id.length === 9 ? parseInt(nominee.nominee.student_id.slice(1, 3)) + 4 : parseInt(nominee.nominee.student_id.slice(0, 2)) + 4}`.slice(-2)
            },
            id: nominee.id,
            selected: false
        }))

        console.log("verified user")

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(nominees_with_year)
            // return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const my_votes = await prisma.vote2024.findMany({
            where: {
                valid: true,
                user: {
                    student_id: session.user.student_id
                }
            },
            include: {
                VotedTo: true
            }
        })

        const nominees_with_year_with_selections = nominees_with_year.map(n => {
            const vote = my_votes.find(v => v.VotedTo.id === n.id)

            return {
                ...n,
                selected: !!vote
            }
        })

        console.log(nominees_with_year_with_selections)

        return NextResponse.json(nominees_with_year_with_selections)
        // [
        //     {
        //         nominatedBy:{
        //             name: ""
        //         },
        //         nominee:{
        //             name:"",
        //             student_id: ""
        //         }
        //     }
        // ]
    } catch (error) {
        return NextResponse.json({
            message: "error"
        }, {
            status: 500
        });
    }
}