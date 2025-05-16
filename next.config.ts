import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos"], // ← Buraya ekleyin
  },
};

export default withNextIntl(nextConfig);
