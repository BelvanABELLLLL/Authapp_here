import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            // callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
            redirect: false,
        });

        if (res?.ok) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const session = await getSession();
            console.log(session)

            const userRole = session?.user?.role; // Assuming role is in user object

            if (userRole === 'admin') {
                router.push("/dashboard/admin");
            } else if (userRole === 'user') {
                router.push("/dashboard/user");
            } else {
                setError("Invalid role");
            }
        } else {
            setError("Login failed. Please check your credentials.");
        }
        setIsLoading(false);
    }

    return (
        <div className="flex justify-center items-center m-auto p-3">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leadingtight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3
leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="***********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-xs italic">{error}</p>}

                <div className="flex flex-col items-center gap-3">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Sign In"}
                    </button>

                    <p className="text-sm text-gray-600">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;