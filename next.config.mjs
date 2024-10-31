import withAntdLess from 'next-plugin-antd-less';

/** @type {import('next').NextConfig} */
const nextConfig = withAntdLess({
  images: {
    domains: ['res.cloudinary.com'],
  },
});

export default nextConfig;
