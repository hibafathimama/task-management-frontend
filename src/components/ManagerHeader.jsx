import { Bell } from "lucide-react";

export default function ManagerHeader({ user }) {
    return (
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center">

            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    Manager Dashboard
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Manage and assign tasks to your team
                </p>
            </div>

            <div className="flex items-center gap-5">

                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                    <Bell size={21} />
                </button>

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {user?.userName?.charAt(0)?.toUpperCase() || "M"}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            {user?.userName || "Manager"}
                        </p>

                        <p className="text-xs text-slate-500">
                            Manager
                        </p>
                    </div>

                </div>

            </div>

        </header>
    );
}