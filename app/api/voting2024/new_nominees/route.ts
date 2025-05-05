import { NextResponse } from "next/server"
import { getStudent } from "lib/api";
import { prisma } from "lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";

export const POST = async (request: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
        error: "已經結束報名了",
        message: "Nominations are closed"
    }, {
        status: 400
    })

    // try {
    //     const body = await request.json();
    //     const { nominee_id, nominee_name } = body;

        
    //     // verify input data in request

    //     const stu = await getStudent({
    //         student_id: nominee_id
    //     })

    //     if (stu?.name !== nominee_name) {
    //         return NextResponse.json({
    //             message: "Student Not Found"
    //         }, {
    //             status: 404
    //         })
    //     }

    //     // verify nominated or not
    //     const nominatees = await prisma.nominee2024.findMany({
    //         where: {
    //             nominee: {
    //                 id: nominee_id
    //             }
    //         }
    //     })

    //     if (nominatees.length > 0) {
    //         return NextResponse.json({
    //             message: "Student Already Nominated"
    //         }, {
    //             status: 400
    //         })
    //     }

    //     // nominated student might not exist in the database USER
    //     const student = await prisma.user.findMany({
    //         where: {
    //             student_id: nominee_id
    //         }
    //     })

    //     if (student.length === 0) {
    //         // nominee has not been registered

    //         // Create user for nominee
    //         console.log("creating dummy user")
    //         await prisma.user.create({
    //             data: {
    //                 student_id: nominee_id,
    //                 name: nominee_name,
    //                 union_fee: stu?.union_fee,
    //                 email: `${stu?.student_id}@fake.arpa`,
    //             }
    //         })
    //     }

    //     // add nominated student to database

    //     const nominator = await prisma.user.findFirst({
    //         where: {
    //             student_id: session.user.student_id,
    //             name: session.user.name
    //         }
    //     })

    //     const nominatee = await prisma.user.findFirst({
    //         where: {
    //             student_id: nominee_id,
    //             name: nominee_name
    //         }
    //     })

    //     if (nominator === null || nominatee === null) {
    //         return NextResponse.json({
    //             message: "No nominator or nominatee found"
    //         }, {
    //             status: 500
    //         })
    //     }

    //     console.log("creating the nominee")

    //     await prisma.nominee2024.create({
    //         data: {
    //             nomiatedBy: {
    //                 connect: {
    //                     id: nominator.id
    //                 }
    //             },
    //             nominee: {
    //                 connect: {
    //                     id: nominatee.id
    //                 }
    //             }
    //         }
    //     })

    //     return NextResponse.json({
    //         message: "success"
    //     });
    // } catch (error) {
    //     return NextResponse.json({
    //         message: "error"
    //     }, {
    //         status: 500
    //     });
    // }
}