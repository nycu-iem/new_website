import { SimpleLayout } from "../../../../components/SimpleLayout";
import { notFound } from 'next/navigation'
import { getPost } from "../../../../lib/api";
import clsx from "clsx";
import Image from "next/image";

import ClientPage from "./client-page"

export default async function Post({ params }: { params: { id: string } }) {
    const post = await getPost(params.id);
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