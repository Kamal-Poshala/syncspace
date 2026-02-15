import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await apiRequest<{ token: string; user: any }>("/auth/register", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            login(data.token, data.user);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
    };

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
                    src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-lines-997-large.mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
                    <div className="text-center">
                        <Link to="/" className="text-4xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
                            SyncSpace
                        </Link>
                        <p className="mt-2 text-gray-300">Create your account</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="rounded-lg bg-red-500/20 p-3 text-center text-sm text-red-200 border border-red-500/30">{error}</div>}

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Register
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
