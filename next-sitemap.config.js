/** @type {import('next-sitemap').IConfig} */
module.exports = {
    transform: async (config, path) => {
        if (isSecurityPath(path)) {
            return null
        }

        if (isMainPage(path)) {
            return {
                loc: path,
                changefreq: 'weekly',
                priority: 0.9,
                lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
                alternateRefs: config.alternateRefs ?? [],
            }
        }

        // default settings

        return {
            loc: path,
            changefreq: config.changefreq,
            priority: 0.7,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: config.alternateRefs ?? [],
        }
    }
}

const isSecurityPath = (page) => {
    return false
}

const isMainPage = (page) => {
    const url = new URL(page);
    switch (url.pathname) {
        case "/":
        case "/about":
        case "/":
            return true;
    }
    return false;
}