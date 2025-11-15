import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  
  typescript: {
     ignoreBuildErrors: true,
  },
} satisfies NextConfig;

export default withNextIntl(nextConfig);
