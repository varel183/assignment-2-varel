"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const registerSchema = z.object({
    username: z.string().min(5, "Minimal 5 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z
        .string()
        .min(6, "Minimal 6 karakter")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, "Password harus mengandung huruf besar, huruf kecil, dan angka"),
});

interface RegisterFormProps {
    switchToLogin: () => void;
}

export default function RegisterForm({ switchToLogin }: RegisterFormProps) {
    const [message, setMessage] = useState("");

    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const registerUser = useMutation({
        mutationFn: async (data: { username: string; email: string; password: string }) => {
            const existingUsers = Cookies.get("users");
            const users = existingUsers ? JSON.parse(existingUsers) : [];

            if (!Array.isArray(users)) return;

            const emailExists = users.some((user: { email: string }) => user.email === data.email);
            if (emailExists) throw new Error("Email sudah terdaftar");

            const response = await axios.post("/api/register", data);

            users.push(data);
            Cookies.set("users", JSON.stringify(users), { expires: 1 });

            return response;
        },
        onSuccess: () => {
            setMessage("Registrasi berhasil!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            setMessage(error instanceof Error ? error.message : "Registrasi gagal!");
        },
    });

    const onSubmit = (data: { username: string; email: string; password: string }) => {
        setMessage("");
        registerUser.mutate(data);
    };

    return (
        <Card className="p-6 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Register</h2>
            {message && <Label className="text-sm text-center mb-2">{message}</Label>}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={registerUser.isPending} className="w-full">
                        {registerUser.isPending ? "Loading..." : "Register"}
                    </Button>

                    <Button onClick={switchToLogin} className="w-full">
                        Sudah punya akun? Login
                    </Button>
                </form>
            </Form>
        </Card>
    );
}
