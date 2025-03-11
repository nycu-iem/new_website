import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export const metadata = {
    title: '陽明交大 工工系學會 考古題網站 | NYCU IEMSA EXAM',
    description: '國立陽明交通大學工業工程與管理學系 官方網站',
}

export default async function ExamPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="h-[70vh] flex flex-col justify-center text-center text-xl">
                登入以查看內容
                <div className="md:hidden block">
                    登入鍵在功能選單裡
                </div>
            </div>
        )
    }

    return (
        <div className="py-[36vh]">
            請點選左側課程以顯示資訊
            {/* <NotionPdf blockId="123" fileSrc="/files/工工系學會第一次會議紀錄.pdf"/> */}
        </div>
    )
}