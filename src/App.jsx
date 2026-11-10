import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/user/dashboard"
                    element={<UserDashboard />}
                />

                <Route
                    path="/manager/dashboard"
                    element={<ManagerDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;