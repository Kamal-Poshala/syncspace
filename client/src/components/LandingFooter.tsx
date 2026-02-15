import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function LandingFooter() {
    return (
        <footer className="relative z-10 mt-32 border-t border-white/10 bg-black/50 py-16 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <Zap className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                            <span className="text-xl font-bold tracking-tight text-white">SyncSpace</span>
                        </Link>
                        <p className="mt-4 max-w-sm text-gray-400">
                            Empowering teams to build the future together with real-time collaboration and seamless communication.
                        </p>
                        <div className="mt-8 flex gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer flex items-center justify-center">
                                    <div className="h-1 w-1 bg-gray-400 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/#features" className="hover:text-white transition cursor-pointer">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition cursor-pointer">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-white transition cursor-pointer">About Us</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition cursor-pointer">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition cursor-pointer">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between border-t border-white/5 pt-8 md:flex-row">
                    <p className="text-sm text-gray-500">
                        © 2026 SyncSpace. Built with Antigravity AI.
                    </p>
                    <p className="mt-4 text-sm text-gray-500 md:mt-0">
                        Designed by <span className="text-gray-300 font-medium">Kamal Poshala</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
