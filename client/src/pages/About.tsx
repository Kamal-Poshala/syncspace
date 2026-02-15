import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Users, Globe, Zap, Heart } from "lucide-react";

export default function About() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-blue-600/10 blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10" />
            </div>

            <LandingNavbar />

            <main className="relative z-10 mx-auto max-w-4xl px-8 pt-20 pb-32">
                <div className="text-center mb-24">
                    <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 backdrop-blur-md">
                        <span className="text-sm font-bold text-blue-400 tracking-wider uppercase">Our Mission</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-8">
                        Building the future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            human connection.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        SyncSpace was born from a simple idea: that distance shouldn't be a barrier to genius. We're crafting the tools that empower teams to flow together, anywhere in the world.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">The Core Philosophy</h2>
                        <p className="text-gray-400 leading-relaxed italic border-l-2 border-blue-500 pl-6">
                            "Collaboration isn't just about sharing files; it's about sharing a state of mind. We build for that state of flow."
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Every pixel in SyncSpace is designed to disappear, letting you focus on what matters most: your work and your teammates. We believe in high-performance minimalism.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={<Users />} label="Teams" val="10k+" />
                        <StatCard icon={<Globe />} label="Countries" val="140+" />
                        <StatCard icon={<Zap />} label="Syncs/Day" val="2M+" />
                        <StatCard icon={<Heart />} label="Love" val="100%" />
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-12 text-center backdrop-blur-xl">
                    <h2 className="text-3xl font-bold mb-6">Want to join us?</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        We are a distributed team of dreamers, builders, and creators. We're always looking for brilliant minds to join the fold.
                    </p>
                    <button className="rounded-full bg-white px-8 py-3 font-bold text-black transition-transform hover:scale-105 active:scale-95">
                        View Careers
                    </button>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}

function StatCard({ icon, label, val }: any) {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <div className="text-blue-400 mb-2">{icon}</div>
            <div className="text-2xl font-black">{val}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}
