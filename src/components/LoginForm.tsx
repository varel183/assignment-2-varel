"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Minimal 6 karakter"),
});

interface LoginFormProps {
    switchToRegister: () => void;
}

export default function LoginForm({ switchToRegister }: LoginFormProps) {
    const [message, setMessage] = useState("");

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => {
            const usersCookie = Cookies.get("users");
            return usersCookie ? JSON.parse(usersCookie) : [];
        },
        staleTime: 0,
    });

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: { email: string; password: string }) => {
        if (!Array.isArray(users) || users.length === 0) {
            setMessage("Belum ada user terdaftar, silakan registrasi terlebih dahulu.");
            return;
        }

        const user = users.find(
            (user: { email: string; password: string }) => user.email === data.email && user.password === data.password
        );

        if (!user) {
            setMessage("Email atau password salah.");
            return;
        }
        setMessage(`Login berhasil! Selamat datang, ${user.username}`);
    };

    return (
        <Card className="p-6 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Login</h2>
            {message && <Label className="text-sm text-center mb-2">{message}</Label>}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Loading..." : "Login"}
                    </Button>

                    <Button onClick={switchToRegister} className="w-full">
                        Belum punya akun? Register
                    </Button>
                </form>
            </Form>
        </Card>
    );
}
