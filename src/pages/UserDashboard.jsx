import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    ClipboardList,
    CheckCircle,
    Clock,
    CalendarDays,
    Search,
    Bell,
    LogOut,
    ListTodo,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import api from "../services/api";

export default function UserDashboard() {
    const navigate = useNavigate();

    // States
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    const [activeTab, setActiveTab] = useState("All Tasks");
    const [searchTerm, setSearchTerm] = useState("");

    // Logged-in user
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks/all");

            setTasks(response.data.tasks || []);

        } catch (error) {
            console.error("Fetch tasks error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load tasks. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // Update task status
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            setUpdatingTaskId(taskId);

            await api.put(`/tasks/update/${taskId}`, {
                status: newStatus,
            });

            // Update frontend state after successful API response
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId
                        ? { ...task, status: newStatus }
                        : task
                )
            );

        } catch (error) {
            console.error("Status update error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update task status"
            );

        } finally {
            setUpdatingTaskId(null);
        }
    };

    // Task statistics
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const pendingTasks = tasks.filter(
        (task) => task.status === "Pending"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    // Search and filter tasks
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab =
            activeTab === "All Tasks" ||
            task.status === activeTab;

        return matchesSearch && matchesTab;
    });

    // Status styles
    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700";

            case "In Progress":
                return "bg-blue-100 text-blue-700";

            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Priority styles
    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-700";

            case "Medium":
                return "bg-orange-100 text-orange-700";

            case "Low":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Format due date
    const formatDate = (date) => {
        if (!date) return "No due date";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#172554] text-white flex flex-col min-h-screen">

                {/* Logo */}
                <div className="px-6 py-7 border-b border-blue-900">

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-500 p-2 rounded-lg">
                            <ListTodo size={24} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold">
                                TaskFlow
                            </h1>

                            <p className="text-xs text-blue-200">
                                Task Management
                            </p>
                        </div>

                    </div>

                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">

                    <p className="text-xs text-blue-300 uppercase font-semibold px-3 mb-4">
                        Menu
                    </p>

                    <button
                        onClick={() => setActiveTab("All Tasks")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white"
                    >
                        <LayoutDashboard size={19} />
                        Dashboard
                    </button>

                    <button
                        onClick={() => setActiveTab("All Tasks")}
                        className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-blue-100 hover:bg-blue-800 transition"
                    >
                        <ClipboardList size={19} />
                        My Tasks
                    </button>

                </nav>

                {/* User Profile */}
                <div className="border-t border-blue-900 p-5">

                    <div className="flex items-center gap-3 mb-5">

                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg">
                            {user.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="overflow-hidden">

                            <p className="font-semibold text-sm truncate">
                                {user.userName || "User"}
                            </p>

                            <p className="text-xs text-blue-200 truncate">
                                {user.email || "User Account"}
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-sm text-blue-200 hover:text-white transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 min-w-0">

                {/* HEADER */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Dashboard
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage and track your assigned tasks
                        </p>
                    </div>

                    <div className="flex items-center gap-5">

                        <button
                            onClick={fetchTasks}
                            disabled={loading}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
                            title="Refresh tasks"
                        >
                            <RefreshCw
                                size={20}
                                className={loading ? "animate-spin" : ""}
                            />
                        </button>

                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                            <Bell size={21} />

                            {pendingTasks > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {user.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                    </div>

                </header>

                {/* PAGE CONTENT */}
                <div className="p-8">

                    {/* Welcome Banner */}
                    <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-white mb-8">

                        <h1 className="text-2xl md:text-3xl font-bold">
                            Welcome back, {user.userName || "User"}!
                        </h1>

                        <p className="text-blue-100 mt-2">
                            Here's an overview of your tasks. Stay organized
                            and keep up the great work!
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-sm text-blue-100">
                            <CalendarDays size={17} />

                            {new Date().toLocaleDateString("en-IN", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </div>

                    </section>

                    {/* STATISTICS */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                        {/* Total Tasks */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Total Tasks
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {totalTasks}
                                    </h2>
                                </div>

                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <ClipboardList size={24} />
                                </div>

                            </div>

                        </div>

                        {/* Pending */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Pending Tasks
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {pendingTasks}
                                    </h2>
                                </div>

                                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                                    <Clock size={24} />
                                </div>

                            </div>

                        </div>

                        {/* In Progress */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        In Progress
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {inProgressTasks}
                                    </h2>
                                </div>

                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <RefreshCw size={24} />
                                </div>

                            </div>

                        </div>

                        {/* Completed */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Completed
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {completedTasks}
                                    </h2>
                                </div>

                                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                    <CheckCircle size={24} />
                                </div>

                            </div>

                        </div>

                    </section>

                    {/* MY TASKS */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm">

                        {/* Section Header */}
                        <div className="p-6 border-b border-slate-200">

                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        My Tasks
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        View your assigned tasks and their progress
                                    </p>
                                </div>

                                {/* Search */}
                                <div className="relative">

                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2 mt-6">

                                {[
                                    "All Tasks",
                                    "Pending",
                                    "In Progress",
                                    "Completed",
                                ].map((tab) => (

                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                            activeTab === tab
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                    >
                                        {tab}
                                    </button>

                                ))}

                            </div>

                        </div>

                        {/* TASK LIST */}
                        <div className="p-6">

                            {/* Loading */}
                            {loading && (

                                <div className="flex flex-col items-center justify-center py-16">

                                    <RefreshCw
                                        size={32}
                                        className="text-blue-600 animate-spin"
                                    />

                                    <p className="text-slate-500 mt-4">
                                        Loading your tasks...
                                    </p>

                                </div>

                            )}

                            {/* Error */}
                            {!loading && error && (

                                <div className="text-center py-12">

                                    <AlertCircle
                                        size={40}
                                        className="text-red-500 mx-auto"
                                    />

                                    <p className="text-red-600 mt-3">
                                        {error}
                                    </p>

                                    <button
                                        onClick={fetchTasks}
                                        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Try Again
                                    </button>

                                </div>

                            )}

                            {/* Empty State */}
                            {!loading && !error && filteredTasks.length === 0 && (

                                <div className="text-center py-16">

                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">

                                        <ClipboardList
                                            size={30}
                                            className="text-slate-400"
                                        />

                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-700 mt-4">
                                        No tasks found
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-2">
                                        {tasks.length === 0
                                            ? "You don't have any assigned tasks yet."
                                            : "Try changing your search or filter."}
                                    </p>

                                </div>

                            )}

                            {/* Task Cards */}
                            {!loading && !error && filteredTasks.length > 0 && (

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                    {filteredTasks.map((task) => (

                                        <div
                                            key={task._id}
                                            className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
                                        >

                                            {/* Task Title and Priority */}
                                            <div className="flex justify-between items-start gap-3">

                                                <div>
                                                    <h3 className="font-semibold text-slate-800 text-base">
                                                        {task.title}
                                                    </h3>

                                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                                        {task.description}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getPriorityStyle(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>

                                            </div>

                                            {/* Status and Due Date */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">

                                                <span
                                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${getStatusStyle(
                                                        task.status
                                                    )}`}
                                                >
                                                    {task.status}
                                                </span>

                                                <div className="flex items-center gap-2 text-xs text-slate-500">

                                                    <CalendarDays size={15} />

                                                    <span>
                                                        Due: {formatDate(task.dueDate)}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Update Status Dropdown */}
                                            <div className="mt-4 pt-4 border-t border-slate-100">

                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Update Task Status
                                                </label>

                                                <select
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            task._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={updatingTaskId === task._id}
                                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                                >

                                                    <option value="Pending">
                                                        Pending
                                                    </option>

                                                    <option value="In Progress">
                                                        In Progress
                                                    </option>

                                                    <option value="Completed">
                                                        Completed
                                                    </option>

                                                </select>

                                                {updatingTaskId === task._id && (

                                                    <p className="text-xs text-blue-600 mt-2">
                                                        Updating status...
                                                    </p>

                                                )}

                                            </div>

                                            {/* Created By */}
                                            {task.createdBy && (

                                                <div className="mt-4">

                                                    <p className="text-xs text-slate-500">
                                                        Assigned by:{" "}
                                                        <span className="font-medium text-slate-700">
                                                            {task.createdBy.userName || "Manager"}
                                                        </span>
                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}