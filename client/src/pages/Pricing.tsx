import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Check, Zap, Rocket, Crown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10" />
            </div>

            <LandingNavbar />

            <main className="relative z-10 mx-auto max-w-7xl px-8 pt-20 pb-32 text-center">
                <div className="mb-16">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Scale your collaboration with plans designed for individuals, teams, and enterprises.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Free Plan */}
                    <PricingCard
                        icon={<Zap className="h-6 w-6 text-gray-400" />}
                        tier="Starter"
                        price="0"
                        desc="Perfect for individuals and side projects."
                        features={[
                            "Up to 3 Workspaces",
                            "10 Members per Workspace",
                            "Unlimited Messages",
                            "Community Support"
                        ]}
                    />

                    {/* Pro Plan */}
                    <PricingCard
                        icon={<Rocket className="h-6 w-6 text-blue-400" />}
                        tier="Pro"
                        price="19"
                        desc="Best for growing teams and startups."
                        popular
                        features={[
                            "Unlimited Workspaces",
                            "Unlimited Members",
                            "Advanced RBAC Controls",
                            "Priority Email Support",
                            "Custom Branded Links"
                        ]}
                    />

                    {/* Enterprise Plan */}
                    <PricingCard
                        icon={<Crown className="h-6 w-6 text-purple-400" />}
                        tier="Enterprise"
                        price="Custom"
                        desc="Security and scale for large organizations."
                        features={[
                            "SAML Single Sign-On",
                            "Dedicated Account Manager",
                            "Custom SLA & Uptime Guarantee",
                            "Audit Logs & Compliance",
                            "On-premise Deployment Options"
                        ]}
                    />
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}

function PricingCard({ icon, tier, price, desc, features, popular = false }: any) {
    return (
        <div className={`relative group rounded-3xl border ${popular ? 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_40px_rgba(37,99,235,0.1)]' : 'border-white/10 bg-white/5'} p-10 text-left backdrop-blur-xl transition-all hover:-translate-y-2`}>
            {popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-black uppercase tracking-widest">
                    Most Popular
                </div>
            )}
            <div className="mb-6 flex items-center gap-4">
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold">{tier}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{popular ? 'Standard' : 'Free Forever'}</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{price === 'Custom' ? 'Let\'s Talk' : `$${price}`}</span>
                    {price !== 'Custom' && <span className="text-gray-500 font-medium">/mo</span>}
                </div>
                <p className="mt-2 text-sm text-gray-400">{desc}</p>
            </div>

            <ul className="mb-10 space-y-4">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-blue-500 shrink-0" />
                        {f}
                    </li>
                ))}
            </ul>

            <Link
                to="/register"
                className={`flex w-full items-center justify-center rounded-2xl py-4 text-center font-bold transition-all ${popular ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
                Get Started
            </Link>
        </div>
    );
}
