/** @type {import('next').NextConfig} */

// Without basePath, apache won't render the pages correctly
// source: https://stackoverflow.com/questions/68227531/loading-of-core-scripts-fail-when-using-apache-for-next-js-reverse-proxy

module.exports = {
    reactStrictMode: true,
    target: 'server',
    basePath: '/inventory',
    env: {
        HOSTNAME: process.env.HOSTNAME
    }
};
