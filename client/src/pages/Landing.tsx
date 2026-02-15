import { Link } from "react-router-dom";
import { ArrowRight, Zap, Layout, Shield } from "lucide-react";

export default function Landing() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-40"
                    // Placeholder video until user uploads 'hero-bg.mp4'
                    // Using a high-quality tech/abstract placeholder from a reliable CDN if local missing
                    src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-lines-997-large.mp4"
                // Fallback to local
                // src="/assets/hero-bg.mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-20" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 backdrop-blur-md border border-blue-400/30">
                        <Zap className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">SyncSpace</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 text-center sm:pt-32">
                <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-300">v2.0 Now Available</span>
                </div>

                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">
                        Sync Your World.
                    </span>
                    <span className="block mt-2">Build Together.</span>
                </h1>

                <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 sm:text-xl">
                    The premium collaborative workspace for modern teams. Real-time editing, rich media, and seamless communication in one stunning interface.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link
                        to="/register"
                        className="group relative flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]"
                    >
                        Start Collaborating Free
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
                    >
                        Live Demo
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
                    <FeatureCard
                        icon={<Layout />}
                        title="Premium UI"
                        desc="Glassmorphism, animated gradients, and a pixel-perfect design system."
                    />
                    <FeatureCard
                        icon={<Zap />}
                        title="Real-time Sync"
                        desc="Changes happen instantly with WebSocket technology. No lag, just flow."
                    />
                    <FeatureCard
                        icon={<Shield />}
                        title="Secure & Private"
                        desc="Your data is encrypted and protected. Private workspaces by default."
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/10 hover:border-white/20">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-600/20 p-3 text-blue-400 ring-1 ring-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="text-gray-400">{desc}</p>
        </div>
    );
}
