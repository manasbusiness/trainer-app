"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileText, Settings, LogOut, ShieldCheck, ChevronLeft, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AdminSidebarContent({ isCollapsed = false, isMobile = false }: { isCollapsed?: boolean; isMobile?: boolean }) {
    const pathname = usePathname();

    const links = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-blue-500 to-blue-600" },
        { href: "/admin/students", label: "Students", icon: Users, gradient: "from-indigo-500 to-indigo-600" },
        { href: "/admin/tests", label: "Tests", icon: FileText, gradient: "from-purple-500 to-purple-600" },
    ];

    return (
        <>
            {/* Header */}
            <div className={cn(
                "flex items-center border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-800 to-slate-900",
                isCollapsed && !isMobile ? "h-14 justify-center" : "h-14 justify-center"
            )}>
                <div className="flex items-center gap-2 text-white">
                    <div className="p-1.5 bg-white/10 rounded-md backdrop-blur-sm">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <div>
                            <span className="font-bold text-sm block">Trainer</span>
                            <span className="text-[10px] text-slate-400">Admin Portal</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4 px-2">
                <nav className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 group relative overflow-hidden text-sm",
                                    isActive
                                        ? "bg-white dark:bg-slate-800 shadow-sm"
                                        : "hover:bg-white/50 dark:hover:bg-slate-800/50"
                                )}
                                title={isCollapsed && !isMobile ? link.label : undefined}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className={cn(
                                        "absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b",
                                        link.gradient
                                    )} />
                                )}

                                {/* Icon */}
                                <div className={cn(
                                    "p-1.5 rounded-md transition-all duration-200",
                                    isActive
                                        ? `bg-gradient-to-br ${link.gradient}`
                                        : "bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600"
                                )}>
                                    <link.icon className={cn(
                                        "h-3.5 w-3.5 transition-colors",
                                        isActive ? "text-white" : "text-slate-600 dark:text-slate-300"
                                    )} />
                                </div>

                                {/* Label */}
                                {(!isCollapsed || isMobile) && (
                                    <span className={cn(
                                        "font-medium text-xs transition-colors",
                                        isActive
                                            ? "text-slate-900 dark:text-white"
                                            : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                                    )}>
                                        {link.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer - Logout */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-2">
                <Link
                    href="/api/auth/logout"
                    prefetch={false}
                    onClick={(e) => {
                        e.preventDefault();
                        fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/login");
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 group text-sm"
                    title={isCollapsed && !isMobile ? "Logout" : undefined}
                >
                    <div className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-all">
                        <LogOut className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <span className="font-medium text-xs text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400">
                            Logout
                        </span>
                    )}
                </Link>
            </div>
        </>
    );
}

export function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Mobile Sidebar - Sheet */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="fixed top-4 left-4 z-40 lg:hidden"
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-56">
                        <div className="flex h-full flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                            <AdminSidebarContent isMobile={true} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar - Collapsible */}
            <div className={cn(
                "hidden lg:flex h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative",
                isCollapsed ? "w-16" : "w-56"
            )}>
                <AdminSidebarContent isCollapsed={isCollapsed} />

                {/* Collapse Toggle Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "absolute -right-3 top-20 h-6 w-6 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all",
                        "shadow-md"
                    )}
                >
                    <ChevronLeft className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        isCollapsed && "rotate-180"
                    )} />
                </Button>
            </div>
        </>
    );
}
