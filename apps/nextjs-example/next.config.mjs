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

    // 设置 webpack 的 publicPath
    if (isProd && !isVercel) {
      config.output.publicPath = "/aptos-wallet-adapter/";
    } else {
      config.output.publicPath = "";
    }

    return config;
  },
};

export default nextConfig;
