import { SimpleLayout } from "components/SimpleLayout";
import { notFound } from 'next/navigation'
import { getPost } from "lib/api";

import ClientPage from "./client-page"

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
    const p = await params
    const post = await getPost(p.id);
    // console.log(post?.content[0].paragraph);

    if (!post) {
        notFound();
    }

    return (
        <>
            <SimpleLayout
                title={post.title}
                intro={post.description}
                // className="border-b"
                is_post={true}
            >
                <ClientPage post={post} />
            </SimpleLayout>
        </>
    )
}