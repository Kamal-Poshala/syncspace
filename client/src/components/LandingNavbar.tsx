import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function LandingNavbar() {
    return (
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 backdrop-blur-sm">
            <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 backdrop-blur-md border border-blue-400/30 group-hover:bg-blue-600/30 transition-colors">
                    <Zap className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">SyncSpace</span>
            </Link>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 mr-4">
                    <Link to="/pricing" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Pricing</Link>
                    <Link to="/about" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">About</Link>
                </div>
                <Link to="/login" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    Log in
                </Link>
                <Link
                    to="/register"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                >
                    Get Started
                </Link>
            </div>
        </nav>
    );
}
