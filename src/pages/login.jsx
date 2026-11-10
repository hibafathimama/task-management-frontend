import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "text-sm font-medium text-slate-700";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const { data } = await api.post("/auth/login", formData);

            // Check login response
            if (!data.token || !data.user) {
                setError("Invalid login response from server.");
                return;
            }

            // Get user role
            const role = data.user.role?.toLowerCase().trim();

            // Store authentication details
            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...data.user,
                    role,
                })
            );

            // Redirect based on role
            switch (role) {
                case "admin":
                    navigate("/admin/dashboard", { replace: true });
                    break;

                case "manager":
                    navigate("/manager/dashboard", { replace: true });
                    break;

                case "user":
                    navigate("/user/dashboard", { replace: true });
                    break;

                default:
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    setError(
                        "Invalid user role. Please contact the administrator."
                    );
                    break;
            }

        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.response?.data?.message ||
                "Login failed. Please check your email and password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">

            <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-8 shadow-lg">

                {/* Heading */}
                <div className="flex flex-col items-center gap-2 text-center">

                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
                        T
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Welcome Back
                    </h1>

                    <p className="text-sm text-slate-500">
                        Login to your Task Management account
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Email */}
                    <div className="flex flex-col gap-2">

                        <label htmlFor="email" className={labelClass}>
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">

                        <label htmlFor="password" className={labelClass}>
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Footer */}
                <p className="text-center text-sm text-slate-600">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;