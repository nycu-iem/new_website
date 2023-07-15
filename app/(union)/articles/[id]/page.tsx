import { SimpleLayout } from "../../../../components/SimpleLayout";
import { notFound } from 'next/navigation'
import { getPost } from "../../../../components/api";

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
            >
                <div className="space-y-10">
                    {post.content && post.content.map((block) => (
                        <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200"
                            key={block.paragraph}
                        >
                            {block.paragraph}
                        </p>
                    ))}
                </div>
            </SimpleLayout>
        </>
    )
}