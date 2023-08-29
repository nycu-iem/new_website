'use client'

import {
    forwardRef,
    Fragment,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react'
import Highlighter from 'react-highlight-words'
import { createAutocomplete } from '@algolia/autocomplete-core'
import {
    usePathname,
    useRouter,
    useSearchParams
} from 'next/navigation'
import {
    Dialog,
    Transition
} from '@headlessui/react'
import clsx from 'clsx'

import {
    NoResultsIcon,
    SearchIcon
} from "components/Icon"
import { FirstLayerOfPost } from '../notion_api'


function useAutocomplete({
    close,
    sections
}: {
    close: () => void,
    sections: Array<FirstLayerOfPost>
}) {
    const id = useId()
    const router = useRouter()
    const [autocompleteState, setAutocompleteState] = useState({})

    function navigate({
        itemUrl
    }: {
        itemUrl: string
    }) {
        router.push(itemUrl)

        if (itemUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
            close()
        }
    }

    const autocomplete = createAutocomplete({
        id,
        placeholder: 'Find something...',
        defaultActiveItemId: 0,
        onStateChange({ state }) {
            setAutocompleteState(state)
        },
        shouldPanelOpen({ state }) {
            return state.query !== ''
        },
        navigator: {
            navigate,
        },
        getSources({ query }) {
            // TODO: Awaiting searchable lists
            return []
        },
    })

    return { autocomplete, autocompleteState }
}

function LoadingIcon({
    ...props
}: {
    className?: string
}) {
    let id = useId()

    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
            <path stroke={`url(#${id})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
            />
            <defs>
                <linearGradient
                    id={id}
                    x1="13"
                    x2="9.5"
                    y1="9"
                    y2="15"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="currentColor" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

function HighlightQuery({
    text,
    query
}: {
    text: string,
    query: string,
}) {
    return (
        <Highlighter
            highlightClassName="underline bg-transparent text-emerald-500"
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={text}
        />
    )
}

// function SearchResult({
//     result,
//     resultIndex,
//     autocomplete,
//     collection,
//     query,
// }: {
//     result: string
//     resultIndex: number
//     autocomplete: string
//     collection: {
//         items: any[]
//     }
//     query: string
// }) {

//     const id = useId()

//     const sectionTitle = navigation.find((section) =>
//         section.links.find((link) => link.href === result.url.split('#')[0])
//     )?.title

//     let hierarchy = [sectionTitle, result.pageTitle].filter(Boolean)

//     return (
//         <li className={clsx(
//             'group block cursor-default px-4 py-3 aria-selected:bg-zinc-50 dark:aria-selected:bg-zinc-800/50',
//             resultIndex > 0 && 'border-t border-zinc-100 dark:border-zinc-800'
//         )}
//             aria-labelledby={`${id}-hierarchy ${id}-title`}
//             {...autocomplete.getItemProps({
//                 item: result,
//                 source: collection.source,
//             })}
//         >
//             <div
//                 id={`${id}-title`}
//                 aria-hidden="true"
//                 className="text-sm font-medium text-zinc-900 group-aria-selected:text-emerald-500 dark:text-white"
//             >
//                 <HighlightQuery text={result.title} query={query} />
//             </div>
//             {hierarchy.length > 0 && (
//                 <div
//                     id={`${id}-hierarchy`}
//                     aria-hidden="true"
//                     className="mt-1 truncate whitespace-nowrap text-2xs text-zinc-500"
//                 >
//                     {hierarchy.map((item, itemIndex, items) => (
//                         <Fragment key={itemIndex}>
//                             <HighlightQuery text={item} query={query} />
//                             <span
//                                 className={
//                                     itemIndex === items.length - 1
//                                         ? 'sr-only'
//                                         : 'mx-2 text-zinc-300 dark:text-zinc-700'
//                                 }
//                             >
//                                 /
//                             </span>
//                         </Fragment>
//                     ))}
//                 </div>
//             )}
//         </li>
//     )
// }

function SearchResults({
    autocomplete,
    query,
    collection
}: {
    autocomplete: any,
    query: any,
    collection: {
        items: Array<any>
    },
}) {
    if (collection.items.length === 0) {
        return (
            <div className="p-6 text-center">
                <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
                <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
                    Nothing found for{' '}
                    <strong className="break-words font-semibold text-zinc-900 dark:text-white">
                        &lsquo;{query}&rsquo;
                    </strong>
                    . Please try again.
                </p>
            </div>
        )
    }

    return (
        <ul role="list" {...autocomplete.getListProps()}>
            {collection.items.map((result, resultIndex) => (
                // <SearchResult
                //     key={result.url}
                //     result={result}
                //     resultIndex={resultIndex}
                //     autocomplete={autocomplete}
                //     collection={collection}
                //     query={query}
                // />
                <div key={resultIndex}/>
            ))}
        </ul>
    )
}

const SearchInput = forwardRef(function SearchInput(
    { autocomplete, autocompleteState, onClose }: {
        autocomplete: any
        autocompleteState: any,
        onClose: any
    },
    inputRef
) {
    let inputProps = autocomplete.getInputProps({})

    return (
        <div className="group relative flex h-12">
            <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500" />
            <input
                ref={inputRef}
                className={clsx(
                    'flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
                    autocompleteState.status === 'stalled' ? 'pr-11' : 'pr-4'
                )}
                {...inputProps}
                onKeyDown={(event) => {
                    if (
                        event.key === 'Escape' &&
                        !autocompleteState.isOpen &&
                        autocompleteState.query === ''
                    ) {
                        if (document.activeElement) {
                            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
                            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
                            // @ts-ignore comment
                            document.activeElement.blur()
                        }

                        onClose()
                    } else {
                        inputProps.onKeyDown(event)
                    }
                }}
            />
            {autocompleteState.status === 'stalled' && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                    <LoadingIcon className="h-5 w-5 animate-spin stroke-zinc-200 text-zinc-900 dark:stroke-zinc-800 dark:text-emerald-400" />
                </div>
            )}
        </div>
    )
})

function SearchDialog({
    open,
    setOpen,
    className,
    sections
}: {
    open: boolean,
    setOpen: (open: boolean) => void
    className: string,
    sections: Array<FirstLayerOfPost>
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { autocomplete, autocompleteState } = useAutocomplete({
        close() {
            setOpen(false)
        },
        sections,
    })
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        setOpen(false)
    }, [pathname, searchParams, setOpen])

    useEffect(() => {
        if (open) {
            return
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                setOpen(true)
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [open, setOpen])

    return (
        <Transition.Root
            show={open}
            as={Fragment}
            afterLeave={() => autocomplete.setQuery('')}
        >
            <Dialog
                onClose={setOpen}
                className={clsx('fixed inset-0 z-50', className)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto transform-gpu overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 sm:max-w-xl">
                            <div {...autocomplete.getRootProps({})}>
                                {/* @ts-ignore */}
                                <form
                                    ref={formRef}
                                    {...autocomplete.getFormProps({
                                        inputElement: inputRef.current,
                                    })}
                                >
                                    <SearchInput
                                        ref={inputRef}
                                        autocomplete={autocomplete}
                                        autocompleteState={autocompleteState}
                                        onClose={() => setOpen(false)}
                                    />
                                    {/* @ts-ignore */}
                                    <div ref={panelRef}
                                        className="border-t border-zinc-200 bg-white empty:hidden dark:border-zinc-100/5 dark:bg-white/2.5"
                                        {...autocomplete.getPanelProps({})}
                                    >
                                        {/* @ts-ignore */}
                                        {autocompleteState?.isOpen && (
                                            <SearchResults
                                                autocomplete={autocomplete}
                                                // @ts-ignore
                                                query={autocompleteState?.query}
                                                // @ts-ignore
                                                collection={autocompleteState?.collections[0]}
                                            />
                                        )}
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

function useSearchProps() {
    let buttonRef = useRef<HTMLButtonElement>(null)
    let [open, setOpen] = useState(false)

    return {
        buttonProps: {
            ref: buttonRef,
            onClick() {
                setOpen(true)
            },
        },
        dialogProps: {
            open,
            setOpen: useCallback(
                (open: boolean) => {
                    if (buttonRef.current) {
                        const { width, height } = buttonRef.current.getBoundingClientRect()
                        if (!open || (width !== 0 && height !== 0)) {
                            setOpen(open)
                        }
                    }
                },
                [setOpen]
            ),
        },
    }
}

export function Search({
    sections
}: {
    sections: Array<FirstLayerOfPost>
}) {
    const [modifierKey, setModifierKey] = useState<string>('Ctrl ');
    const { buttonProps, dialogProps } = useSearchProps()
    // const [trayOpen, setTrayOpen] = useState<boolean>(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setModifierKey(
            navigator.userAgent!.match(
                /Mac|iPhone|iPod|iPad/i
            ) ? "⌘" : "Ctrl "
            // /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgentData) ? '⌘' : 'Ctrl '
        )
    }, [])

    return (
        <div className="hidden lg:block lg:max-w-md lg:flex-auto">
            <button
                type="button"
                className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 ui-not-focus-visible:outline-none dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex"
                // // open={trayOpen}
                // onClick={()=>{setTrayOpen(true)}}
                {...buttonProps}
            >
                <SearchIcon className="h-5 w-5 stroke-current" />
                Find something...
                <div className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
                    <kbd className="font-sans">{modifierKey}</kbd>
                    <kbd className="font-sans">K</kbd>
                </div>
            </button>
            <SearchDialog
                className="hidden lg:block"
                sections={sections}
                {...dialogProps}
            />
        </div>
    )
}

export function MobileSearch({
    sections
}: {
    sections: Array<FirstLayerOfPost>
}) {
    const { buttonProps, dialogProps } = useSearchProps()

    return (
        <div className="contents lg:hidden">
            <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 ui-not-focus-visible:outline-none dark:hover:bg-white/5 lg:hidden"
                aria-label="Find something..."
                {...buttonProps}
            >
                <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
            </button>
            <SearchDialog
                className="lg:hidden"
                sections={sections}
                {...dialogProps}
            />
        </div>
    )
}
