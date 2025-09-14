import "./globals.css";

export const metadata = {
  title: "Real Estate",
  description: "Properties catalog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
