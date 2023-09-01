import Link from 'next/link'

import { Header } from 'components/Header'
import { Footer } from 'components/Footer'
import { SimpleLayout } from '../components/SimpleLayout'

// export default function NotFound() {
//   return <div>
//       <h1>Not found – 404!</h1>
//       <div>
//         <Link href="/">Go back to Home</Link>
//       </div>
//   </div>
// }

export default function NotFound() {
    return (
        <div className="flex h-full flex-col w-full">
            <div className="fixed inset-0 flex justify-center sm:px-8">
                <div className="flex w-full max-w-7xl lg:px-8">
                    <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
                </div>
            </div>
            <div className="relative">
                <Header />
                <main>
                    <SimpleLayout
                        title="ㄨㄚˊ找不到啦"
                        intro=''>
                            如果你沒有亂打網址的話，請幫我複製網站連結並且到首頁填寫表單ㄅㄞˇㄊㄨㄛ。我程式很爛，但有ㄋㄧˇ的幫助我就能改進吧。
                        {/* <Link href="/">回主畫面</Link> */}
                    </SimpleLayout>
                </main>
                <Footer />
            </div>

        </div>
    )
}