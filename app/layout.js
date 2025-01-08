import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.css";

export const metadata = {
  title: "Facebook"
};

export default function RootLayout({children}) {
  
  return <html>
    <head>
      <link rel="shortcut icon" href="facebook.png"></link>
      <meta charSet="UTF-8"></meta>
    </head>
    <body>
      <>{children}</>
      
    </body>
  </html>
}
