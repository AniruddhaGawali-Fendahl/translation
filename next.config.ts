import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./i18n/request.ts",
});
export default withNextIntl(nextConfig);
