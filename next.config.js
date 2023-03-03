/** @type {import('next').NextConfig} */

// Without basePath, apache won't render the pages correctly
// source: https://stackoverflow.com/questions/68227531/loading-of-core-scripts-fail-when-using-apache-for-next-js-reverse-proxy

module.exports = {
    reactStrictMode: true,
    //swcMinify: true, // does not work on linux/apache: https://nextjs.org/docs/messages/swc-minify-enabled
    basePath: '/inventory',
    env: {
        HOSTNAME: process.env.HOSTNAME
    }
};
