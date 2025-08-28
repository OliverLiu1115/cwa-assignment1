import "./styles.css";
import Link from "next/link";
import DarkSwitch from "./components/DarkSwitch";
// Metadata for the whole website (title shown in browser tab)
export const metadata = {
  title: "Web Application",
  
};
// RootLayout is the main layout of the app
// It wraps around every page (header, footer, navigation etc.)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
            
(function(){
  try {
     // Check if there is a saved path in cookies
    var m = document.cookie.match(/lastPath=([^;]+)/);
    if (m) {
      var path = decodeURIComponent(m[1]);
      // If path exists and is not current page, redirect
      if (path && path !== location.pathname && path !== "/") {
        location.replace(path);
      }
    }
 // Function to save the current path into cookies
    function savePath() {
      document.cookie =
        "lastPath=" + encodeURIComponent(location.pathname) +
        "; path=/; max-age=2592000";
    }
    window.addEventListener("pageshow", savePath);
    window.addEventListener("popstate", savePath);

 // Handle dark mode: get saved theme from localStorage or use system preference
    var s = localStorage.getItem('theme');
    var dark = s ? s==='dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    if(dark) document.documentElement.classList.add('dark');
  } catch(e){}
})();
          `,
          }}
        />
      </head>
      <body>
        <header className="site-header">
          <div className="site-header__row">
            <div className="site-title">CWA Assignment 1</div>
            <div className="site-actions">
              <DarkSwitch />
              <div className="student-no">G'DAY,22176739</div>
              <button className="hamburger" aria-label="Menu" title="Menu">≡</button>
            </div>
          </div>

          //* Navigation bar with links to different pages //
          <nav className="menu-bar" aria-label="Sections">
            <ul>
              <li><Link href="/">Tabs</Link></li>
              <li><Link href="/prelab">Pre-lab Questions</Link></li>
              <li><Link href="/escaperoom">Escape Room</Link></li>
              <li><Link href="/codingraces">Coding Races</Link></li>
              <li className="spacer" aria-hidden>|</li>
              <li className="right"><Link href="/about">About</Link></li>
            </ul>
          </nav>
        </header>

        <main className="site-main">{children}</main>

        //* Footer with student info and current date //
        <footer className="site-footer">
          <small>
            Copyright YOUR_NAME · YOUR_STUDENT_NUMBER · {new Date().toISOString().slice(0,10)}
          </small>
        </footer>
      </body>
    </html>
  );
}

