const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.NODE_ENV_VERCEL === "1";

console.log(`Current log: isVercel: `, isVercel);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
  assetPrefix: isProd ? (isVercel ? "" : "/aptos-wallet-adapter") : "",
  basePath: isProd ? (isVercel ? "" : "/aptos-wallet-adapter") : "",
  webpack: (config) => {
    config.resolve.fallback = { "@solana/web3.js": false };

    // 对于静态导出，让 Next.js 自动处理 publicPath
    // 只在非 Vercel 的生产环境中手动设置
    if (isProd && !isVercel) {
      config.output.publicPath = "/aptos-wallet-adapter/";
    }

    return config;
  },
};

export default nextConfig;
