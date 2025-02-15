"use client";

import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";

export default function Home() {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Auth System</h1>
            {isLogin ? (
                <LoginForm switchToRegister={() => setIsLogin(false)} />
            ) : (
                <RegisterForm switchToLogin={() => setIsLogin(true)} />
            )}
        </div>
    );
}
