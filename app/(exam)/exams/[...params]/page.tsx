import { getNavigationLinks } from "../../notion_api"
import { } from 'next/navigation'

export default async function SectionPage({
    params,
    searchParams,
}: {
    params: { params: Array<string> },
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const info = await getNavigationLinks();


    return (
        <>
            {params.params[0]}
            {decodeURI(params.params[1])}
        </>
    )
}