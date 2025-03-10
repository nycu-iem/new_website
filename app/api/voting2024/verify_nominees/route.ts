import { NextResponse } from "next/server"
import { getStudent } from "lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { prisma } from "lib/prisma"

export const POST = async (request: Request) => {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json();
        const { id } = body;

        const student = await getStudent({
            student_id: id
        })

        if (student?.student_id !== id) {
            return NextResponse.json({
                message: "Student Not Found"
            }, {
                status: 404
            })
        }

        if (!student) {
            console.log("Student Not found")
            return NextResponse.json({
                message: "Student Not Found"
            })
        }

        const stu = await prisma.nominee2024.findMany({
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