/** @type {import('next').NextConfig} */
const nextConfig = {
   compiler: {
       styledComponents: true,
   },
   experimental: {
       optimizePackageImports: ["@chakra-ui/react"],
   },
   images: {
       remotePatterns: [
           {
               protocol: 'http',
               hostname: '127.0.0.1',
               port: '8080',
               pathname: '/storage/**',
           },
       ],
   },
   async rewrites() {
       return [
           {
               source: '/api/:path*',
               destination: 'http://127.0.0.1:8080/api/:path*',
           },
       ];
   },
};

module.exports = nextConfig;