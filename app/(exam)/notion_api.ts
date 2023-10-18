import { notion } from "lib/notion"

export const getExams = async ({
    pageId
}: {
    pageId: string
}) => {

    const result = await notion.getBlocks({ pageId });

    return result;
}

interface PostsWithKeys {
    [grade: string]: {
        [semester: string]: {
            [permanant_course_id: string]: {
                [teacher: string]: {
                    page_id: string,
                    course_name: string,
                    semester: string,
                    sections: Array<string>
                }
            }
        }
    }
}

export const getNavigationLinks: () => Promise<Array<FirstLayerOfPost>> = async () => {
    const result = await notion.getDatabase({
        pageId: "4967854be961410f8c64e7db9e524440"
    })
    // console.log(result.results)

    let posts_with_keys: PostsWithKeys = {
        '大一': {},
        '大二': {},
        '大三': {},
        '大四': {},
        '其他': {},
    }

    await Promise.all(result.results.map(async (data: any) => {
        // console.log(data)
        const permanent_course_id = `${data.properties["永久課號"]?.rich_text[0]?.plain_text ?? 'undefined'}${data.properties["教授"]?.select?.name ?? 'undefined'}`;
        const teacher = data.properties["教授"]?.select?.name ?? 'undefined';
        const course_name = data.properties["課程名稱"]?.select?.name ?? 'undefined';
        const semester = data.properties["學期"]?.select?.name ?? '暑假';
        const title = data.properties["標題"]?.title[0]?.plain_text ?? '標題';
        const grade_temp = data.properties["年級"]?.select?.name ?? '其他';
        console.log("temp: ", grade_temp)
        const re = /[大一|大二|大三|大四]/
        const grade = (re.exec(grade_temp) ? grade_temp : "其他")
        console.log("final: ", grade)
        const id = data.id

        const course_info = await notion.getBlocks({ pageId: id });

        const sections: string[] = course_info.results.map((block: any) => {
            if (block.type === "paragraph") {
                const text = block.paragraph.rich_text[0]?.plain_text ?? ''
                const title = /{(.*)}/gm.exec(text);

                if (title) {
                    return title[1]
                }
            }
            return "";
        }).filter((str: string) => (str !== ""))

        // console.log(sections)

        posts_with_keys[grade] = posts_with_keys[grade] || {};
        posts_with_keys[grade][semester] = posts_with_keys[grade][semester] || {}
        posts_with_keys[grade][semester][permanent_course_id] = posts_with_keys[grade][semester][permanent_course_id] || {};
        posts_with_keys[grade][semester][permanent_course_id][teacher] = posts_with_keys[grade][semester][permanent_course_id][teacher] || {
            course_name: title ?? course_name,
            sections,
            page_id: id,
        };
    }))

    // example
    // exams/[notion uuid]#[段落摘要]
    let navigation: Array<FirstLayerOfPost> = [
        {
            title: "大一",
            classes: []
        }, {
            title: "大二",
            classes: []
        }, {
            title: "大三",
            classes: []
        }, {
            title: "大四",
            classes: []
        }, {
            title: "其他選修課",
            classes: []
        }
    ];

    // console.log("posts with keys")
    // console.log(posts_with_keys)

    Object.keys(posts_with_keys).map((grade: string) => {
        const gradeInNumber = (grade === '大一') ? 0
            : (grade === '大二' ? 1 :
                (grade === '大三') ? 2 :
                    (grade === '大四' ? 3 : 4))
        Object.keys(posts_with_keys[grade]).map((semester) => {
            Object.keys(posts_with_keys[grade][semester]).map((course_id) => {
                const teacher_array = Object.keys(posts_with_keys[grade][semester][course_id]);

                const course = posts_with_keys[grade][semester][course_id][teacher_array[0]];
                navigation[gradeInNumber].classes.push({
                    title: course.course_name,
                    page_id: course.page_id,
                    sections: course.sections,
                    semester,
                })

            })
        })
    })

    // console.log("navigations")
    // console.log(navigation[0].classes)

    return navigation;
}

export interface FirstLayerOfPost {
    title: string,
    classes: Array<Course>
}

export interface Course {
    title: string,
    page_id: string,
    semester: string, // '上學期' | '下學期' | '暑假'
    sections: string[]
}

// example link : `/exam/${page_id}/section`