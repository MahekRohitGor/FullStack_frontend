import "./globals.css";
import { ReduxProvider } from "./store/ReduxProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ReduxProvider>
        {children}
      </ReduxProvider>
      </body>
    </html>
  );
}
