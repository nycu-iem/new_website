

export const getExams = async ({
    title,
    link,
}: Course) => {
    // TODO: connect to notion api
}

export const getNavigationLinks: () => Promise<Array<FirstLayerOfPost>> = async () => {

    // example
    // [年級]/[課程名稱-老師名稱]#[考古題|心得|]

    // TODO: add notion api
    return [
        {
            title: "大一上",
            link: "/exams/grade-1-1",
            classes: [
                {
                    title: "會計一-蔡碧輝",
                    link: "課號1",
                    sections: [
                        "考古一:2022期中",
                        "考古一:2022期末",
                    ]
                }
            ]
        }, {
            title: "大一下",
            link: "/exams/grade-1-2",
            classes: [
                {
                    title: "會計二-蔡碧輝",
                    link: "課號2",
                    sections: [
                        "考古二:2022期中",
                        "考古二:2022期末",
                    ]
                }
            ]
        }, {
            title: "大二",
            link: "/exams/grade-2",
            classes: []
        }, {
            title: "大三",
            link: "/exams/grade-3",
            classes: []
        }, {
            title: "大四",
            link: "/exams/grade-4",
            classes: []
        }, {
            title: "工工系選修",
            link: "/exams/others",
            classes: []
        }
    ]
}

export interface FirstLayerOfPost {
    title: string,
    link: string,
    classes: Array<Course>
}

export interface Course {
    title: string,
    link: string,
    sections: Array<string>
}