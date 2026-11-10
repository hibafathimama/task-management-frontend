import {
    LayoutDashboard,
    ClipboardList,
    PlusCircle,
    LogOut,
    ListTodo,
} from "lucide-react";

export default function ManagerSidebar({
    activeTab,
    setActiveTab,
    onLogout,
}) {
    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "My Tasks",
            icon: ClipboardList,
        },
    ];

    return (
        <aside className="w-64 bg-[#172554] text-white min-h-screen flex flex-col">

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
                            Manager Panel
                        </p>
                    </div>

                </div>

            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">

                <p className="text-xs text-blue-300 uppercase font-semibold px-3 mb-4">
                    Menu
                </p>

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                                activeTab === item.name
                                    ? "bg-blue-600 text-white"
                                    : "text-blue-100 hover:bg-blue-800"
                            }`}
                        >
                            <Icon size={19} />
                            {item.name}
                        </button>
                    );
                })}

                <button
                    onClick={() => setActiveTab("Create Task")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === "Create Task"
                            ? "bg-blue-600 text-white"
                            : "text-blue-100 hover:bg-blue-800"
                    }`}
                >
                    <PlusCircle size={19} />
                    Create Task
                </button>

            </nav>

            {/* Logout */}
            <div className="border-t border-blue-900 p-5">

                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 text-sm text-blue-200 hover:text-white transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </aside>
    );
}