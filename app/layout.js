import "./globals.css";

export const metadata = { title: "MLS Sekolah", description: "Manajemen Learning System" };

export default function RootLayout({ children }) {
  return <html lang="id"><body>{children}</body></html>;
}
