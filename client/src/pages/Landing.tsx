import { Link } from "react-router-dom";
import { ArrowRight, Globe, Users, Code } from "lucide-react";
import { motion } from "framer-motion";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";

export default function Landing() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden mesh-background text-white selection:bg-primary/30">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-blob [animation-delay:2s]" />
            </div>

            <LandingNavbar />

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-300">SyncSpace Architecture v2.0</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto max-w-5xl text-6xl font-black tracking-tighter sm:text-8xl lg:text-9xl leading-[0.9]"
                >
                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                        SYNC YOUR
                    </span>
                    <span className="block italic text-primary">ENTITY.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mx-auto mt-12 max-w-2xl text-xl text-gray-400 sm:text-2xl font-light leading-relaxed"
                >
                    Transcending traditional collaboration. A hyper-fluid workspace designed for the next generation of digital architects.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex flex-col gap-6 sm:flex-row sm:justify-center"
                >
                    <Link
                        to="/register"
                        className="group relative overflow-hidden rounded-full bg-primary px-10 py-5 text-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Initialize Space
                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-10 py-5 text-xl font-medium text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
                    >
                        Enter Core
                    </Link>
                </motion.div>

                {/* Floating Preview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4, delay: 0.7 }}
                    className="mt-32 w-full max-w-6xl glass-card rounded-[2.5rem] p-4 group overflow-hidden"
                >
                    <div className="aspect-video w-full rounded-[1.5rem] bg-black/40 overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-primary/20 text-9xl font-black rotate-[-10deg] select-none">SYNCSPACE</div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div id="features" className="mt-40 grid w-full max-w-6xl grid-cols-1 gap-12 px-4 sm:grid-cols-3">
                    <FeatureCard
                        icon={<Globe className="h-7 w-7" />}
                        title="Universal Scale"
                        desc="Built on a globally distributed edge network for zero-latency collaboration across any distance."
                    />
                    <FeatureCard
                        icon={<Users className="h-7 w-7" />}
                        title="Neural Sync"
                        desc="Advanced CRDT algorithms ensure perfect state harmony between all participants, instantly."
                    />
                    <FeatureCard
                        icon={<Code className="h-7 w-7" />}
                        title="Architectural Integrity"
                        desc="A design system forged in glass and light, prioritizing focus and creative cognitive flow."
                    />
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group rounded-3xl border border-white/5 bg-white/[0.02] p-10 text-left backdrop-blur-xl transition-all hover:bg-white/[0.05] hover:border-primary/20"
        >
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {icon}
            </div>
            <h3 className="mb-4 text-2xl font-black tracking-tight uppercase italic">{title}</h3>
            <p className="text-gray-300 font-medium leading-relaxed">{desc}</p>
        </motion.div>
    );
}
