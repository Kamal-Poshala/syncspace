import { Link } from "react-router-dom";
import { Zap, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-950 font-sans text-white">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/20 backdrop-blur-xl border border-blue-400/30 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                    <Zap className="h-10 w-10 text-blue-400" />
                </div>

                <h1 className="text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 opacity-20">
                    404
                </h1>

                <h2 className="mt-4 text-3xl font-bold sm:text-4xl text-white">Page Not Found</h2>

                <p className="mt-6 max-w-md text-lg text-gray-400">
                    The space you're looking for doesn't exist or has been moved to a different orbit.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </button>
                </div>
            </div>

            <div className="absolute bottom-10 text-sm text-gray-600">
                © 2026 SyncSpace | Mission Control
            </div>
        </div>
    );
}
