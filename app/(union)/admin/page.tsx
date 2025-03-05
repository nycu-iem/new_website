'use server'
import { SimpleLayout } from "components/SimpleLayout";
import { notFound } from "next/navigation";
import { getStudent } from "lib/api";
import { auth } from "@/app/auth"


import ClientSide from './client'

export default async function AdminPage() {
    const session = await auth();
    
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

