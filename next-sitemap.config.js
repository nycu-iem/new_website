/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || `https://${process.env.HOST}`,
    // generateRobotsTxt: true, // (optional)
    // ...other options
}