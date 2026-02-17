```
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import LandingNavbar from "../components/LandingNavbar";

export default function Landing() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-black text-white selection:bg-primary/30">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-60"
                    src="/assets/syncspace1.mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>

            <LandingNavbar />

            {/* Hero Section - Radically Simple */}
            <main className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-7xl font-black tracking-tighter sm:text-9xl leading-none">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 uppercase">
                            SyncSpace
                        </span>
                    </h1>

                    <div className="mt-16">
                        <Link
                            to="/register"
                            className="group relative overflow-hidden rounded-full bg-white px-12 py-6 text-xl font-bold text-black transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Initialize
                                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                        </Link>
                    </div>
                </motion.div>
            </main>

            {/* Subtle Credit */}
            <div className="absolute bottom-8 left-0 right-0 z-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 select-none">
                    Next Gen Collaboration
                </p>
            </div>
        </div>
    );
}
```
