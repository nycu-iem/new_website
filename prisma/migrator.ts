import { Account, PrismaClient, User } from '@prisma/client'
import fs from "fs"
import csv from "csv-parser"

const prisma = new PrismaClient()

async function account() {
    const location = "prisma/db/account.csv"

    const results: Account[] = []
    fs.createReadStream(location)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {

            for (const row of results) {
                console.log(row)

                await prisma.account.create({
                    data: {
                        id: row.id,
                        type: row.type,
                        provider: row.provider,
                        providerAccountId: row.providerAccountId,
                        refresh_token: row.refresh_token,
                        access_token: row.access_token,
                        expires_at: row.expires_at ? parseInt(row.expires_at as any) : null,
                        token_type: row.token_type,
                        scope: row.scope,
                        id_token: row.id_token,
                        session_state: row.session_state,
                        createdAt: new Date(row.createdAt),
                        updatedAt: new Date(row.updatedAt),
                        userId: row.userId,
                    },
                })
            }
            console.log('Data successfully added to the database')
        })
}

async function user() {
    const location = "prisma/db/user.csv"

    const results: User[] = []
    fs.createReadStream(location)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {

            for (const row of results) {
                console.log(row)

                await prisma.user.create({
                    data: {
                        id: row.id,
                        name: row.name,
                        student_id: row.student_id,
                        email: row.email,
                        emailVerified: row.emailVerified ? new Date(row.emailVerified) : null,
                        image: row.image,
                        union_fee: (row.union_fee as any) === 'true',
                        createdAt: new Date(row.createdAt),
                        updatedAt: new Date(row.updatedAt),
                    },
                })
            }
            console.log('Data successfully added to the database')
            await prisma.$disconnect()
        })
}


const main = async () => {
    // await user();
    // await account();
    
    await prisma.$disconnect()
}

main()

//TODO: check for the annoymous users if their name exist on notion