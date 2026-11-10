import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "text-sm font-medium text-slate-700";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        role: "user",
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
            await api.post("/auth/register", formData);

            alert("Registration successful! Please login.");

            navigate("/login");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
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
                        Create Account
                    </h1>

                    <p className="text-sm text-slate-500">
                        Register for your Task Management account
                    </p>

                </div>

                {/* Error Message */}
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Username */}
                    <div className="flex flex-col gap-2">

                        <label htmlFor="userName" className={labelClass}>
                            Username
                        </label>

                        <input
                            id="userName"
                            type="text"
                            name="userName"
                            placeholder="Enter your username"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>

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
                            minLength={6}
                            required
                            className={inputClass}
                        />

                    </div>

                    {/* Select Role */}
                    <div className="flex flex-col gap-2">

                        <label htmlFor="role" className={labelClass}>
                            Select Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>

                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                {/* Footer */}
                <p className="text-center text-sm text-slate-600">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;