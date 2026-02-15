import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";

export default function LegalPage({ title, lastUpdated }: { title: string, lastUpdated: string }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white">
            <LandingNavbar />

            <main className="relative z-10 mx-auto max-w-3xl px-8 pt-20 pb-32">
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">{title}</h1>
                    <p className="text-sm text-gray-500 font-medium">Last Updated: {lastUpdated}</p>
                </div>

                <div className="prose prose-invert prose-blue max-w-none space-y-8 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p className="leading-relaxed">
                            Welcome to SyncSpace. These terms govern your use of our platform and services. By accessing or using SyncSpace, you agree to be bound by these policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Your Data & Privacy</h2>
                        <p className="leading-relaxed">
                            We take your privacy seriously. All data transmitted through SyncSpace is encrypted. We do not sell your personal information to third parties. For more details, please review our specific policy sections regarding data retention and encryption standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Acceptable Use</h2>
                        <p className="leading-relaxed">
                            Users are expected to use SyncSpace for collaborative, professional, or personal creative purposes. Any use of the platform for illegal activities, harassment, or distribution of malicious software is strictly prohibited and will result in immediate account termination.
                        </p>
                    </section>

                    <section className="rounded-2xl bg-white/5 p-8 border border-white/10">
                        <p className="text-sm italic">
                            Disclaimer: This is a placeholder legal document for the SyncSpace SaaS demonstration. In a production environment, ensure you consult with legal counsel to draft comprehensive terms and privacy policies compliant with regional regulations (GDPR, CCPA, etc.).
                        </p>
                    </section>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
