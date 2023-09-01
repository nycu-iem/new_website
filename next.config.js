/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "s3.us-west-2.amazonaws.com"
            }, {
                protocol: "https",
                hostname: "**"
            }
        ]
    },
    // config.module.rules.push()
    webpack: (config) => {
        config.module.rules.push({
            test: /\.node/,
            use: 'raw-loader',
        });

        return config;
    },
    experimental: {
        serverActions: true,
    },

    // webpack: (config) => { config.externals.push({ sharp: 'commonjs sharp', canvas: 'commonjs canvas' }) return config }
}

module.exports = nextConfig
