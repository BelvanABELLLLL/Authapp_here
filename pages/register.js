import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function SignIn() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passError, setPassError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Tambahkan error message
    const [isLoading, setIsLoading] = useState(false); // Tambahkan loading state

    useEffect(() => {
        validatePassword(password, confirmPassword);
    }, [password, confirmPassword]);

    function validatePassword(pass, confirmPass) {
        setPassError(pass !== confirmPass);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage(""); // Reset error message
        setIsLoading(true); // Set loading ke true
        // Validasi password sebelum mengirim data ke server

        if (password !== confirmPassword) {
            setPassError(true);
            setIsLoading(false);
            return;
        }

        let userData = {
            name,
            email,
            password,
        };

        try {
            const res = await fetch("/api/user/create", {
                method: "POST",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            console.log("Registration successful", data);
            alert("Registration successful! Redirecting to login...");
            router.push("/login"); // Redirect ke halaman login setelah berhasil
        } catch (error) {
            console.error("Registration error:", error.message);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false); // Matikan loading setelah request selesai
        }
    }

    return (
        <div className="flex justify-center items-center m-auto p-3">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leadingtight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

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

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3
leading-tight focus:outline-none focus:shadow-outline"
                        id="confirm-password"
                        type="password"
                        placeholder="***********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passError && (
                        <p className="text-red-500 text-xs italic">Passwords do not match!</p>
                    )}
                </div>

                {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}

                <div className="flex flex-col items-center gap-3">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
focus:outline-none focus:shadow-outline w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Sudah punya akun? Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignIn;