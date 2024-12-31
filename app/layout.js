import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav"
import "@fortawesome/fontawesome-free/css/all.css";

export const metadata = {
  title: "Facebook"
};

export default function RootLayout({ children }) {
  return <html>
    <head>
      <link rel="shortcut icon" href="facebook.png"></link>
    </head>
    <body>
      <>{children}</>
    </body>
  </html>
}
