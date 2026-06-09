import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "AI Orbit OS",
  description: "Solar-system style machine learning and deep learning platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
