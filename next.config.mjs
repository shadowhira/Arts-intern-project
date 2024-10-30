/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "images.pexels.com",
  //       port: "",
  //       pathname: "/photos/**",
  //     },
  //   ],
  // },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
