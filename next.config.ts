import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    domains:   ['kscuisine.com', "images.unsplash.com",'public.readdy.ai','ui-avatars.com','res.cloudinary.com'] ,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
       
      }
    ],
  },
}


export default nextConfig;
