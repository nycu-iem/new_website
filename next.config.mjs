/** @type {import('next').NextConfig} */
// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');

// if (process.env.NODE_ENV === 'development') {
//     await setupDevPlatform();
// }

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
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.node/,
            use: 'raw-loader',
        });

        if (!isServer) {
            config.resolve.alias["canvas"] = false;
        }

        return config;
    },
    experimental: {
        serverActions: true,
    },

    // webpack: (config) => { config.externals.push({ sharp: 'commonjs sharp', canvas: 'commonjs canvas' }) return config }
}

module.exports = nextConfig
