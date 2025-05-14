import { NextResponse } from "next/server";
import { getStudent } from "lib/api";
import { prisma } from "lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/auth";

import { z } from "zod"

const votable = false;

export async function GET(
    request: Request,
) {
    try {
        const nominees = await prisma.nominee2025.findMany({
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

        const my_votes = await prisma.vote2025.findMany({
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

export const POST = async (request: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bodySchema = z.object({
        nominee_id: z.string().min(1, "Nominee ID is required"),
        nominee_name: z.string().min(1, "Nominee Name is required")
    })

    if (!votable) {
        return NextResponse.json({
            message: "Not votable"
        }, {
            status: 400
        })
    }

    try {
        const body = bodySchema.safeParse(await request.json())

        if (!body.success) {
            return NextResponse.json({
                message: body.error.issues[0].message
            }, {
                status: 400
            })
        }

        const params = body.data

        // verify input data in request

        const stu = await getStudent({
            student_id: params.nominee_id
        })


        if (stu?.name !== params.nominee_name) {
            return NextResponse.json({
                message: "Student Not Found"
            }, {
                status: 404
            })
        }

        if (stu.in_department === false) {
            return NextResponse.json({
                message: "學生不在籍是要投什麼"
            }, {
                status: 400
            })
        }

        // verify nominated or not
        const nominatees = await prisma.nominee2025.findMany({
            where: {
                nominee: {
                    id: params.nominee_id
                }
            }
        })

        if (nominatees.length > 0) {
            return NextResponse.json({
                message: "Student Already Nominated"
            }, {
                status: 400
            })
        }

        // nominated student might not exist in the database USER
        const student = await prisma.user.findMany({
            where: {
                student_id: params.nominee_id
            }
        })

        if (student.length === 0) {
            // nominee has not been registered

            // Create user for nominee
            console.log("creating dummy user")
            await prisma.user.create({
                data: {
                    student_id: params.nominee_id,
                    name: params.nominee_name,
                    union_fee: stu?.union_fee,
                    email: `${stu?.student_id}@fake.arpa`,
                }
            })
        }

        // add nominated student to database

        const nominator = await prisma.user.findFirst({
            where: {
                student_id: session.user.student_id,
                name: session.user.name
            }
        })

        const nominatee = await prisma.user.findFirst({
            where: {
                student_id: params.nominee_id,
                name: params.nominee_name
            }
        })

        if (nominator === null || nominatee === null) {
            return NextResponse.json({
                message: "No nominator or nominatee found"
            }, {
                status: 500
            })
        }

        console.log("creating the nominee")

        await prisma.nominee2025.create({
            data: {
                nomiatedBy: {
                    connect: {
                        id: nominator.id
                    }
                },
                nominee: {
                    connect: {
                        id: nominatee.id
                    }
                }
            }
        })

        return NextResponse.json({
            message: "success"
        });
    } catch (error) {
        return NextResponse.json({
            message: "error"
        }, {
            status: 500
        });
    }
}

export const PUT = async (request: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bodySchema = z.object({
        id: z.string().min(1, "Nominee ID is required"),
        option: z.boolean()
    })

    if (!votable) {
        return NextResponse.json({
            message: "Not votable"
        }, {
            status: 400
        })
    }

    // option : true / false
    // id => nominee id

    try {
        // get user votes

        // if greater than 2 skipped
        // get votes
        const body = bodySchema.safeParse(await request.json())
        if (!body.success) {
            return NextResponse.json({
                message: body.error.issues[0].message
            }, {
                status: 400
            })
        }
        const params = body.data

        const my_votes = await prisma.vote2025.findMany({
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

        const voteTo = await prisma.nominee2025.findUnique({
            where: {
                id: params.id
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

        if (params.option === true) {
            console.log("vote")
            if (my_votes.length >= 2) {
                return NextResponse.json({
                    message: "You can only vote in maximum 2 person"
                }, {
                    status: 402
                });
            }

            my_votes.forEach(async (v) => {
                if (v.VotedTo.id === params.id) {
                    return NextResponse.json({
                        message: "You have voted this person"
                    }, {
                        status: 402
                    });
                }
            })

            console.log("creating vote")
            await prisma.vote2025.create({
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
                if (v.VotedTo.id === params.id) {
                    await prisma.vote2025.update({
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