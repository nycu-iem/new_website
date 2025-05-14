import { NextResponse } from "next/server"
import { getStudent } from "lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/auth";
import { prisma } from "lib/prisma"

import { z } from "zod"

const votable = false;

export const POST = async (request: Request) => {

    if (!votable) {
        return NextResponse.json({
            message: "投票尚未開始"
        }, {
            status: 400
        })
    }

    const bodySchema = z.object({
        id: z.string().min(1, "ID is required")
    })

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // zod validation
        const body = bodySchema.safeParse(await request.json())
        if (!body.success) {
            return NextResponse.json({
                message: body.error.issues[0].message
            }, {
                status: 400
            })
        }
        const params = body.data

        const student = await getStudent({
            student_id: params.id
        })

        console.log(student)

        if (student?.student_id !== params.id) {
            return NextResponse.json({
                message: "Student Not Found"
            }, {
                status: 404
            })
        }

        if (student.in_department === false) {
            return NextResponse.json({
                message: "學生不在籍是要投什麼"
            }, {
                status: 400
            })
        }

        if (!student) {
            console.log("Student Not found")
            return NextResponse.json({
                message: "Student Not Found"
            })
        }

        const stu = await prisma.nominee2025.findMany({
            where: {
                nominee: {
                    student_id: student.student_id
                }
            }
        })

        console.log(stu)

        if (stu.length > 0) {
            return NextResponse.json({
                error: "Nominated"
            }, {
                status: 400,
                statusText: "Nominated"
            });
        }

        return NextResponse.json({
            student_name: student.name,
            student_id: student.student_id,
            nominator: session.user.name
        });
    } catch (error) {
        console.log("error")

        return NextResponse.json({
            message: "error"
        }, {
            status: 500
        });
    }
}