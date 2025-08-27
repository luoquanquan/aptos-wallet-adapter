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

    // 设置 webpack 的 publicPath，确保与 assetPrefix 保持一致
    if (isProd) {
      if (isVercel) {
        // Vercel 部署时使用相对路径
        config.output.publicPath = "./";
      } else {
        // 其他生产环境使用绝对路径
        config.output.publicPath = "/aptos-wallet-adapter";
      }
    } else {
      // 开发环境使用相对路径
      config.output.publicPath = "./";
    }

    return config;
  },
};

export default nextConfig;
