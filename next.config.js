/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      // जेव्हा तू बॅकएंड डिप्लॉय करशील (उदा. Render किंवा AWS वर), 
      // तेव्हा त्याचा डोमेन इथे ॲड करायला विसरू नकोस.
      /* {
        protocol: 'https',
        hostname: 'your-api-domain.com',
        pathname: '/**',
      },
      */
    ],
  },
};

export default nextConfig;