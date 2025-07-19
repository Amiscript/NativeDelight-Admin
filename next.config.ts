import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    domains:   ['kscuisine.com', "images.unsplash.com",'public.readdy.ai'] ,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
       
      }
    ],

    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud-name/image/upload',
  },
}


export default nextConfig;
