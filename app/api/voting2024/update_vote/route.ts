import { NextResponse } from "next/server"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

import { prisma } from "lib/prisma"

export const POST = async (request: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, option } = await request.json();

    // option : true / false
    // id => nominee id

    try {
        // get user votes

        // if greater than 2 skipped
        // get votes

        const my_votes = await prisma.vote2024.findMany({
            where: {
                user: {
                    student_id: session.user.student_id
                },
                valid: true
            }, include: {
                VotedTo: true
            }
        })

        console.log("votes got")

        const user = await prisma.user.findFirst({
            where: {
                student_id: session.user.student_id
            }
        })

        const voteTo = await prisma.nominee2024.findUnique({
            where: {
                id: id
            }
        })

        if (user === null || voteTo === null) {
            return NextResponse.json({
                message: "Invalid Input Data"
            }, {
                status: 400
            })
        }

        console.log("user and voteTo got")

        if (option === true) {
            console.log("vote")
            if (my_votes.length >= 2) {
                return NextResponse.json({
                    message: "You can only vote in maximum 2 person"
                }, {
                    status: 402
                });
            }

            my_votes.forEach(async (v) => {
                if (v.VotedTo.id === id) {
                    return NextResponse.json({
                        message: "You have voted this person"
                    }, {
                        status: 402
                    });
                }
            })

            console.log("creating vote")
            await prisma.vote2024.create({
                data: {
                    valid: true,

                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                    VotedTo: {
                        connect: {
                            id: voteTo.id
                        }
                    }
                }
            })

            console.log("good")
            return NextResponse.json({
                message: "good"
            });
        } else {
            console.log("unvote")
            my_votes.forEach(async (v) => {
                if (v.VotedTo.id === id) {
                    await prisma.vote2024.update({
                        where: {
                            id: v.id
                        }, data: {
                            valid: false
                        }
                    })
                    return NextResponse.json({
                        message: "good"
                    });
                }
            })

            return NextResponse.json({
                message: "good"
            })
        }



        // update votes


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "error"
        }, {
            status: 500
        });
    }
}