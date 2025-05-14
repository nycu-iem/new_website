import { prisma } from "@/lib/prisma";

import { SimpleLayout } from "components/SimpleLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminVoting() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user?.email || "",
        },
    });

    if (!user) {
        redirect("/login");
    }

    if (user.student_id !== "111704011") {
        redirect("/login");
    }

    const votingCandidates = await prisma.nominee2025.findMany({
        include: {
            votes: true,
            nominee: true,
            nomiatedBy: true,
        }
    });

    return (
        <SimpleLayout
            title="Admin Voting"
            intro=""
        >
            <section className="flex flex-col gap-4">
                <h1>2025 voting result</h1>

                <div className="grid grid-cols-3">
                    <div>被提名人</div>
                    <div>提名人</div>
                    <div>選票</div>

                    {votingCandidates.map((candidate) => (<React.Fragment key={candidate.id}>
                        <div>{candidate.nominee.name}</div>
                        <div>{candidate.nomiatedBy.name}</div>
                        <div>{candidate.votes.map((v): number => (v.valid ? 1 : 0))
                            .reduce((pre, curr) => (pre + curr)
                            )}</div>
                    </React.Fragment>))}
                </div>
            </section>
        </SimpleLayout>
    );
} 