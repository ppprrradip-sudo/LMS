/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	outputFileTracingIncludes: {
		"/api/**/*": ["./data/db.json"]
	}
};
export default nextConfig;
