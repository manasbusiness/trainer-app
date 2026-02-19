"use client";

import Link from "next/link";
import { Menu, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

interface AdminNavbarProps {
    onToggleSidebar?: () => void;
    userName?: string;
    userEmail?: string;
}

export function AdminNavbar({ onToggleSidebar, userName = "Admin", userEmail = "admin@trainer.com" }: AdminNavbarProps) {
    return (
        <nav className="sticky top-0 z-40 bg-white border-b border-vega-gray-200 dark:bg-background dark:border-border transition-colors duration-300">
            <div className="flex items-center justify-between h-14 px-3 md:px-4">
                {/* Left Section - Mobile Menu & Search */}
                <div className="flex items-center gap-2 md:gap-3 flex-1">
                    {/* Mobile Menu Button - Visible on mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        className="lg:hidden hover:bg-vega-gray-100 dark:hover:bg-accent rounded-lg h-9 w-9"
                    >
                        <Menu className="h-5 w-5 text-vega-gray-600 dark:text-foreground" />
                    </Button>

                    {/* Desktop Toggle Button - Hidden on mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        className="hidden lg:flex hover:bg-vega-gray-100 dark:hover:bg-accent rounded-lg"
                    >
                        <Menu className="h-5 w-5 text-vega-gray-600 dark:text-foreground" />
                    </Button>
                </div>

                {/* Right Section - Notifications & User */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <ModeToggle />
                    {/* User Profile */}
                    <div className="flex items-center gap-2 pl-2 border-l border-vega-gray-200 dark:border-border cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-medium text-vega-gray-700 dark:text-foreground">{userName}</p>
                            <p className="text-[10px] text-vega-gray-400 dark:text-muted-foreground">{userEmail}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
