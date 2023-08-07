interface Course {
    courseName: string,
    courseId: string,
    teacher: string,
}

export const getExams = async ({
    courseName,
    courseId,
    teacher,
}: Course) => {
    // TODO: connect to notion api
}

export const getNavigationLinks: () => Promise<Array<FirstLayerOfPost>> = async () => {
    // TODO: add notion api
    return [
        {
            title: "測量",
            id: "messure",
            children: [
                {
                    title: "誤差計算",
                    id: "calculate",
                }, {
                    title: "誤差統整",
                    id: "sum-up"
                }
            ]
        }, {
            title: "網頁",
            id: "website",
            children: [
                {
                    title: "網際網路",
                    id: "internet"
                }, {
                    title: "前端後端",
                    id: "back/frontend"
                }
            ]
        }
    ]
}

interface Post {
    title: string,
    id: string,
    children?: Array<Post>
}

export interface FirstLayerOfPost {
    title?: string,
    id: string,
    children?: Array<Post>
}