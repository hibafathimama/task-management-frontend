import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";

export default function CreateTaskModal({ onClose, onTaskCreated }) {

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
    });

    // Fetch registered users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users/all");

                setUsers(response.data.users || []);

            } catch (error) {
                console.error("Fetch users error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load users"
                );
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Create task
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            await api.post("/tasks/create", formData);

            alert("Task created successfully!");

            onTaskCreated();
            onClose();

        } catch (error) {
            console.error("Create task error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create task"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Create New Task
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Assign a new task to your team member
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                        <X size={21} />
                    </button>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Task Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Task Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter task description"
                            rows="4"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Assign User */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Assign To
                        </label>

                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                            required
                            disabled={loadingUsers}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 disabled:bg-slate-100"
                        >
                            <option value="">
                                {loadingUsers
                                    ? "Loading users..."
                                    : "Select a user"}
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

                        {!loadingUsers && users.length === 0 && (
                            <p className="text-xs text-orange-600 mt-2">
                                No users available to assign.
                            </p>
                        )}
                    </div>

                    {/* Priority and Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Due Date
                            </label>

                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                min={new Date().toLocaleDateString("en-CA")}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || loadingUsers || users.length === 0}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {submitting ? "Creating..." : "Create Task"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}