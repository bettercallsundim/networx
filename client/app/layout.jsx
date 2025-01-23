import Nav from "./components/Nav";
import OauthProvider from "./components/OauthProvider";
import ReduxProvider from "./components/ReduxProvider";
import SocketProvider from "./components/SocketProvider";
import ThemeProvider from "./components/ThemeProvider";
import "./globals.css";
import "./index.css";

export const metadata = {
  title: "Networx",
  description: "Next Gen Social Network",
};

export default function RootLayout({ children }) {
  return (
    <ReduxProvider>
      <OauthProvider>
        <html className="roothtml" lang="en">
          <body className="poppins">
            <SocketProvider>
              <ThemeProvider>
                <Nav />
                {children}
              </ThemeProvider>
            </SocketProvider>
          </body>
        </html>
      </OauthProvider>
    </ReduxProvider>
  );
}
