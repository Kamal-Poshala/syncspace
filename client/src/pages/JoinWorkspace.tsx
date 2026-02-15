import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";

export default function JoinWorkspace() {
    const { code } = useParams<{ code: string }>();
    const { joinWorkspace } = useWorkspace();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceOwner, setWorkspaceOwner] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            // Ideally redirect to login with return params, but for now just login
            return;
        }

        const fetchInfo = async () => {
            try {
                const data = await apiRequest<{ name: string; owner: { username: string } }>(
                    `/workspaces/join/${code}`,
                    { token: localStorage.getItem("token") || "" }
                );
                setWorkspaceName(data.name);
                setWorkspaceOwner(data.owner.username);
            } catch (err) {
                setError("Invalid invite code or workspace not found.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInfo();
    }, [code, isAuthenticated]);

    const handleJoin = async () => {
        try {
            const { slug } = await joinWorkspace(code!);
            navigate(`/workspace/${slug}`);
        } catch (err) {
            setError("Failed to join workspace.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold">Please Login to Join</h2>
                    <button onClick={() => navigate("/login")} className="rounded bg-blue-600 px-4 py-2 text-white">
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading invite info...</div>;

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="rounded-xl bg-white p-8 shadow text-center">
                    <h1 className="mb-2 text-xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-600">{error}</p>
                    <button onClick={() => navigate("/")} className="mt-4 text-blue-600 hover:underline">Go Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Join Workspace</h1>
                <p className="mb-6 text-gray-600">
                    You have been invited to join <strong>{workspaceName}</strong> by <strong>{workspaceOwner}</strong>.
                </p>

                <button
                    onClick={handleJoin}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                    Join Now
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-900"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
