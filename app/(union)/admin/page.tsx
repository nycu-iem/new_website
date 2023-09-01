'use server'
import { SimpleLayout } from "components/SimpleLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { getStudent } from "lib/api";

import ClientSide from './client'

export default async function () {
    const session = await getServerSession(authOptions)

    if (!session) {
        notFound();
    }

    if (session.user.name !== '鄭弘煒') {
        notFound();
    }

    const student = await getStudent({
        student_id: '111704011'
    })

    return (
        <SimpleLayout
            title="Testing"
            intro="Introduction for testing">


            <ClientSide data={student} />
        </SimpleLayout>
    )
}

