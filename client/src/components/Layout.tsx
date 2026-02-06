import { ReactNode } from "react";
import "../index.css";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* Header */}
      <header className="header">
        <h1>SyncSpace</h1>
        <span>Real-Time Collaborative Workspace</span>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} SyncSpace • Built with React & Socket.IO
      </footer>
    </>
  );
}

export default Layout;
