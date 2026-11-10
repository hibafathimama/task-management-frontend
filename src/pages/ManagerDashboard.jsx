import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ClipboardList,
    Clock,
    CheckCircle,
    RefreshCw,
    Plus,
    CalendarDays,
    Trash2,
    AlertCircle,
    Pencil,
    X,
} from "lucide-react";

import api from "../services/api";

import ManagerSidebar from "../components/ManagerSidebar";
import ManagerHeader from "../components/ManagerHeader";
import CreateTaskModal from "../components/CreateTaskModal";

const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-2 block text-sm font-medium text-slate-700";

export default function ManagerDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("Dashboard");

    // Create modal
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
    });

    // Fetch manager tasks
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
                "Failed to load tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch users for task assignment and editing
    const fetchUsers = async () => {
        try {
            const response = await api.get("/users/all");
            setUsers(response.data.users || []);
        } catch (error) {
            console.error("Fetch users error:", error);
            throw new Error(
                error.response?.data?.message ||
                "Failed to load users"
            );
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

    // Open edit modal
    const handleEditClick = async (task) => {
        try {
            setEditError("");
            setEditingTaskId(task._id);

            // Load users for the dropdown
            await fetchUsers();

            setEditForm({
                title: task.title || "",
                description: task.description || "",
                assignedTo:
                    task.assignedTo?._id || task.assignedTo || "",
                priority: task.priority || "Medium",
                status: task.status || "Pending",
                dueDate: task.dueDate
                    ? new Date(task.dueDate).toISOString().split("T")[0]
                    : "",
            });

            setShowEditModal(true);
        } catch (error) {
            alert(error.message);
        }
    };

    // Handle edit form changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update task
    const handleUpdateTask = async (e) => {
        e.preventDefault();

        if (!editingTaskId) return;

        try {
            setEditLoading(true);
            setEditError("");

            await api.put(
                `/tasks/update/${editingTaskId}`,
                {
                    title: editForm.title,
                    description: editForm.description,
                    assignedTo: editForm.assignedTo,
                    priority: editForm.priority,
                    status: editForm.status,
                    dueDate: editForm.dueDate,
                }
            );

            alert("Task updated successfully!");

            setShowEditModal(false);
            setEditingTaskId(null);

            await fetchTasks();
        } catch (error) {
            console.error("Update task error:", error);

            setEditError(
                error.response?.data?.message ||
                "Failed to update task"
            );
        } finally {
            setEditLoading(false);
        }
    };

    // Close edit modal
    const closeEditModal = () => {
        if (editLoading) return;

        setShowEditModal(false);
        setEditingTaskId(null);
        setEditError("");
    };

    // Delete task
    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/tasks/delete/${taskId}`);

            setTasks((prevTasks) =>
                prevTasks.filter((task) => task._id !== taskId)
            );

            alert("Task deleted successfully!");
        } catch (error) {
            console.error("Delete task error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    // Statistics
    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
        (task) => task.status === "Pending"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    // Date formatting
    const formatDate = (date) => {
        if (!date) return "No due date";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

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

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Sidebar */}
            <ManagerSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />

            {/* Main */}
            <main className="flex-1 min-w-0">

                <ManagerHeader user={user} />

                <div className="p-8">

                    {/* Welcome */}
                    <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-white mb-8">

                        <h1 className="text-2xl md:text-3xl font-bold">
                            Welcome back, {user.userName || "Manager"}!
                        </h1>

                        <p className="text-blue-100 mt-2">
                            Manage your team's tasks and monitor their progress.
                        </p>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-6 flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                            <Plus size={19} />
                            Create New Task
                        </button>

                    </section>

                    {/* Statistics */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                        <StatCard
                            title="Total Tasks"
                            count={totalTasks}
                            icon={<ClipboardList size={24} />}
                            color="bg-blue-100 text-blue-600"
                        />

                        <StatCard
                            title="Pending Tasks"
                            count={pendingTasks}
                            icon={<Clock size={24} />}
                            color="bg-yellow-100 text-yellow-600"
                        />

                        <StatCard
                            title="In Progress"
                            count={inProgressTasks}
                            icon={<RefreshCw size={24} />}
                            color="bg-indigo-100 text-indigo-600"
                        />

                        <StatCard
                            title="Completed"
                            count={completedTasks}
                            icon={<CheckCircle size={24} />}
                            color="bg-green-100 text-green-600"
                        />

                    </section>

                    {/* Tasks Section */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm">

                        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    {activeTab === "My Tasks"
                                        ? "My Tasks"
                                        : "Task Management"}
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    View and manage tasks created by you
                                </p>
                            </div>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus size={18} />
                                Create Task
                            </button>

                        </div>

                        <div className="p-6">

                            {/* Loading */}
                            {loading && (
                                <div className="text-center py-12">

                                    <RefreshCw
                                        size={30}
                                        className="mx-auto text-blue-600 animate-spin"
                                    />

                                    <p className="text-slate-500 mt-3">
                                        Loading tasks...
                                    </p>

                                </div>
                            )}

                            {/* Error */}
                            {!loading && error && (
                                <div className="text-center py-12">

                                    <AlertCircle
                                        size={35}
                                        className="mx-auto text-red-500"
                                    />

                                    <p className="text-red-600 mt-3">
                                        {error}
                                    </p>

                                    <button
                                        onClick={fetchTasks}
                                        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
                                    >
                                        Try Again
                                    </button>

                                </div>
                            )}

                            {/* Empty state */}
                            {!loading && !error && tasks.length === 0 && (
                                <div className="text-center py-16">

                                    <ClipboardList
                                        size={40}
                                        className="mx-auto text-slate-400"
                                    />

                                    <h3 className="text-lg font-semibold text-slate-700 mt-4">
                                        No tasks created yet
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-2">
                                        Create your first task and assign it to a team member.
                                    </p>

                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Create Your First Task
                                    </button>

                                </div>
                            )}

                            {/* Tasks Table */}
                            {!loading && !error && tasks.length > 0 && (
                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-[850px]">

                                        <thead>
                                            <tr className="text-left text-xs uppercase text-slate-500 border-b">

                                                <th className="pb-4 font-semibold">
                                                    Task
                                                </th>

                                                <th className="pb-4 font-semibold">
                                                    Assigned To
                                                </th>

                                                <th className="pb-4 font-semibold">
                                                    Priority
                                                </th>

                                                <th className="pb-4 font-semibold">
                                                    Due Date
                                                </th>

                                                <th className="pb-4 font-semibold">
                                                    Status
                                                </th>

                                                <th className="pb-4 font-semibold text-center">
                                                    Actions
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {tasks.map((task) => (

                                                <tr
                                                    key={task._id}
                                                    className="border-b border-slate-100 hover:bg-slate-50"
                                                >

                                                    {/* Task */}
                                                    <td className="py-5 pr-4">

                                                        <p className="font-semibold text-slate-800">
                                                            {task.title}
                                                        </p>

                                                        <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">
                                                            {task.description}
                                                        </p>

                                                    </td>

                                                    {/* Assigned User */}
                                                    <td className="py-5 pr-4">

                                                        <p className="text-sm font-medium text-slate-700">
                                                            {task.assignedTo?.userName || "Unknown"}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {task.assignedTo?.email || ""}
                                                        </p>

                                                    </td>

                                                    {/* Priority */}
                                                    <td className="py-5 pr-4">

                                                        <span
                                                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getPriorityStyle(task.priority)}`}
                                                        >
                                                            {task.priority}
                                                        </span>

                                                    </td>

                                                    {/* Due Date */}
                                                    <td className="py-5 pr-4">

                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <CalendarDays size={15} />
                                                            {formatDate(task.dueDate)}
                                                        </div>

                                                    </td>

                                                    {/* Status */}
                                                    <td className="py-5 pr-4">

                                                        <span
                                                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusStyle(task.status)}`}
                                                        >
                                                            {task.status}
                                                        </span>

                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-5">

                                                        <div className="flex items-center justify-center gap-2">

                                                            {/* Edit */}
                                                            <button
                                                                onClick={() => handleEditClick(task)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                                title="Edit task"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                                title="Delete task"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>

                    </section>

                </div>

            </main>

            {/* Create Task Modal */}
            {showCreateModal && (
                <CreateTaskModal
                    onClose={() => setShowCreateModal(false)}
                    onTaskCreated={fetchTasks}
                />
            )}

            {/* Edit Task Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 p-6">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Edit Task
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Update task information
                                </p>
                            </div>

                            <button
                                onClick={closeEditModal}
                                disabled={editLoading}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        {/* Edit Form */}
                        <form
                            onSubmit={handleUpdateTask}
                            className="space-y-4 p-6"
                        >

                            {editError && (
                                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    {editError}
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className={labelClass}>
                                    Task Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleEditChange}
                                    required
                                    className={inputClass}
                                    placeholder="Enter task title"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className={labelClass}>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                    required
                                    rows="3"
                                    className={inputClass}
                                    placeholder="Enter task description"
                                />
                            </div>

                            {/* Assign User */}
                            <div>
                                <label className={labelClass}>
                                    Assign To
                                </label>

                                <select
                                    name="assignedTo"
                                    value={editForm.assignedTo}
                                    onChange={handleEditChange}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select a user
                                    </option>

                                    {users.map((user) => (
                                        <option
                                            key={user._id}
                                            value={user._id}
                                        >
                                            {user.userName} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className={labelClass}>
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={editForm.priority}
                                    onChange={handleEditChange}
                                    className={inputClass}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className={labelClass}>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={editForm.status}
                                    onChange={handleEditChange}
                                    className={inputClass}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Completed">
                                        Completed
                                    </option>
                                </select>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className={labelClass}>
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={editForm.dueDate}
                                    onChange={handleEditChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={editLoading}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {editLoading
                                        ? "Updating..."
                                        : "Update Task"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

// Statistics Card
function StatCard({ title, count, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

            <div className="flex justify-between items-center">

                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                        {count}
                    </h2>
                </div>

                <div className={`p-3 rounded-xl ${color}`}>
                    {icon}
                </div>

            </div>

        </div>
    );
}