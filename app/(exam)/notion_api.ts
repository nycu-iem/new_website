import { getNotionDatabase } from "lib/api"

export const getExams = async ({
    title,
    link,
}: Course) => {
    // TODO: connect to notion api
}

interface PostsWithKeys {
    [grade: string]: {
        [permanant_course_id: string]: {
            [teacher: string]: {
                course_name: string,
                semester: string,
                children: Array<{
                    title: string,
                    page_id: string,
                    type: string
                }>
            }
        }
    }
}

export const getNavigationLinks: () => Promise<Array<FirstLayerOfPost>> = async () => {
    const result = await getNotionDatabase({
        pageId: "4967854be961410f8c64e7db9e524440"
    })
    console.log(result.results)

    let posts_with_keys: PostsWithKeys = {
        '大一': {},
        '大二': {},
        '大三': {},
        '大四': {},
        '其他': {},
    }

    result.results.map((data: any) => {
        // console.log(data)
        const permanent_course_id = data.properties["永久課號"].rich_text[0].plain_text;
        const type = data.properties["類別"].select.name;
        const teacher = data.properties["教授"].select.name;
        const course_name = data.properties["課程名稱"].select.name;
        const semester = data.properties["學期"].select.name;
        const title = data.properties["標題"].title[0].plain_text;
        const grade_temp = data.properties["年級"].select.name;
        const grade = (grade_temp.includes("大一") ? grade_temp : "其他")
        const id = data.id

        posts_with_keys[grade] = posts_with_keys[grade] || {};
        posts_with_keys[grade][permanent_course_id] = posts_with_keys[grade][permanent_course_id] || {};
        posts_with_keys[grade][permanent_course_id][teacher] = posts_with_keys[grade][permanent_course_id][teacher] || {
            course_name,
            semester,
            children: []
        };

        posts_with_keys[grade][permanent_course_id][teacher].children?.push({
            title,
            page_id: id,
            type
        })
    })

    console.log(posts_with_keys)

    // example
    // [年級]/[課程名稱-老師名稱]#[考古題|心得|講義]
    let post: Array<FirstLayerOfPost> = [
        {
            title: "大一上",
            link: "/exams/grade-1-1",
            classes: []
        }, {
            title: "大一下",
            link: "/exams/grade-1-2",
            classes: []
        }, {
            title: "大二上",
            link: "/exams/grade-2-1",
            classes: []
        }, {
            title: "大二下",
            link: "/exams/grade-2-2",
            classes: []
        }, {
            title: "大三上",
            link: "/exams/grade-3-1",
            classes: []
        }, {
            title: "大三下",
            link: "/exams/grade-3-2",
            classes: []
        }, {
            title: "大四上",
            link: "/exams/grade-4-1",
            classes: []
        }, {
            title: "大四下",
            link: "/exams/grade-4-2",
            classes: []
        }, {
            title: "其他選修課",
            link: "/exams/others",
            classes: []
        }
    ];

    Object.keys(posts_with_keys).map((grade: string) => {
        const gradeInNumber = (grade === '大一') ? 0
            : (grade === '大二' ? 1 :
                (grade === '大三') ? 2 :
                    (grade === '大四' ? 3 : 4))
        Object.keys(posts_with_keys[grade]).map((course_id) => {
            const teacher_array = Object.keys(posts_with_keys[grade][course_id]);
            if (teacher_array.length === 1) {
                // only one teacher in this class
                const course = posts_with_keys[grade][course_id][teacher_array[0]];
                post[gradeInNumber * 2 + (course.semester === '上學期' ? 0 : 1)].classes.push({
                    title: course.course_name,
                    link: course.course_name,
                    sections: [
                        ...course.children.filter(c => c.type === '講義').map((element) => ({
                            title: "講義",
                            text: element.title
                        })),
                        ...course.children.filter(c => c.type === '考古題').map((element) => ({
                            title: "考古題",
                            text: element.title
                        })),
                        ...course.children.filter(c => c.type === '心得').map((element) => ({
                            title: "修課心得",
                            text: element.title
                        }))
                    ]
                })
            } else {
                // more than one teacher at the same class
                const first_array_index = post[gradeInNumber * 2 + (posts_with_keys[grade][course_id][teacher_array[0]].semester === '上學期' ? 0 : 1)].classes.length;

                teacher_array.filter(name => name !== "共同").map((teacher_name) => {
                    const course = posts_with_keys[grade][course_id][teacher_name];
                    post[gradeInNumber * 2 + (course.semester === '上學期' ? 0 : 1)].classes.push({
                        title: `${course.course_name} ${teacher_name}`,
                        link: course.course_name,
                        sections: [
                            ...course.children.filter(c => c.type === '講義').map((element) => ({
                                title: "講義",
                                text: element.title
                            })),
                            ...course.children.filter(c => c.type === '考古題').map((element) => ({
                                title: "考古題",
                                text: element.title
                            })),
                            ...course.children.filter(c => c.type === '心得').map((element) => ({
                                title: "修課心得",
                                text: element.title
                            }))
                        ]
                    })
                })
                const common_things = posts_with_keys[grade][course_id]["共同"];
                const gradeIndex = gradeInNumber * 2 + (posts_with_keys[grade][course_id][teacher_array[0]].semester === '上學期' ? 0 : 1)
                for (let i = first_array_index; i < post[gradeIndex].classes.length; ++i){
                    post[gradeIndex].classes[i].sections = [
                        ...post[gradeIndex].classes[i].sections,
                        ...common_things.children.map((element)=>({
                            title: element.type,
                            text: element.title
                        }))
                    ]
                }
            }
        })
    })

    return post;
}

export interface FirstLayerOfPost {
    title: string,
    link: string,
    classes: Array<Course>
}

export interface Course {
    title: string,
    link: string,
    sections: Array<{
        title: string,
        text: string
    }>
}