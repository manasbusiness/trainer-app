"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, User, LogOut, BarChart, GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarContentProps {
    isCollapsed?: boolean;
    isMobile?: boolean;
    onNavigate?: () => void;
}

function SidebarContent({ isCollapsed = false, isMobile = false, onNavigate }: SidebarContentProps) {
    const pathname = usePathname();

    const links = [
        { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/student/tests", label: "Available Tests", icon: FileText },
        { href: "/student/analytics", label: "Analytics", icon: BarChart },
        { href: "/student/profile", label: "Profile", icon: User },
    ];

    return (
        <>
            {/* Header */}
            <div className={cn(
                "flex items-center border-b border-vega-gray-200 bg-white px-4 dark:bg-background dark:border-border",
                isCollapsed && !isMobile ? "h-14 justify-center" : "h-14 gap-2"
            )}>
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-vega-blue-500 rounded-md">
                        <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <span className="font-semibold text-sm text-vega-gray-700 dark:text-foreground">Trainer</span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto px-2 py-2">
                <nav className="space-y-0.5">
                    {links.map((link) => {
                        const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onNavigate}
                                className={cn(
                                    "flex items-center gap-3 rounded-sm px-3 py-2 transition-colors group",
                                    isActive
                                        ? "bg-vega-gray-900 dark:bg-primary"
                                        : "hover:bg-vega-gray-50 dark:hover:bg-accent"
                                )}
                                title={isCollapsed && !isMobile ? link.label : undefined}
                            >
                                <link.icon className={cn(
                                    "h-4 w-4 flex-shrink-0",
                                    isActive ? "text-vega-gray-100 dark:text-primary-foreground" : "text-vega-gray-600 dark:text-muted-foreground"
                                )} />

                                {(!isCollapsed || isMobile) && (
                                    <span className={cn(
                                        "text-sm font-normal",
                                        isActive
                                            ? "text-vega-gray-100 font-medium dark:text-primary-foreground"
                                            : "text-vega-gray-600 dark:text-muted-foreground"
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
            <div className="border-t border-vega-gray-200 px-2 py-2 dark:border-border">
                <Link
                    href="/api/auth/logout"
                    prefetch={false}
                    onClick={(e) => {
                        e.preventDefault();
                        fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/login");
                    }}
                    className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-vega-gray-50 dark:hover:bg-accent group"
                    title={isCollapsed && !isMobile ? "Logout" : undefined}
                >
                    <LogOut className="h-4 w-4 text-vega-gray-600 flex-shrink-0 dark:text-muted-foreground" />
                    {(!isCollapsed || isMobile) && (
                        <span className="text-sm font-normal text-vega-gray-600 dark:text-muted-foreground">
                            Logout
                        </span>
                    )}
                </Link>
            </div>
        </>
    );
}

export function StudentSidebar({ isCollapsed, onToggle, isMobileOpen, onMobileToggle }: {
    isCollapsed?: boolean;
    onToggle?: () => void;
    isMobileOpen?: boolean;
    onMobileToggle?: (open: boolean) => void;
}) {
    return (
        <>
            {/* Mobile Sidebar - Sheet (controlled from navbar) */}
            <div className="lg:hidden">
                <Sheet open={isMobileOpen} onOpenChange={onMobileToggle}>
                    <SheetContent side="left" className="p-0 w-64">
                        <div className="flex h-full flex-col bg-white dark:bg-background">
                            <SidebarContent isMobile={true} onNavigate={() => onMobileToggle?.(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar - Collapsible */}
            <div className={cn(
                "hidden lg:flex h-screen flex-col bg-white border-r border-vega-gray-200 transition-all duration-300 dark:bg-background dark:border-border",
                isCollapsed ? "w-14" : "w-56"
            )}>
                <SidebarContent isCollapsed={isCollapsed} />
            </div>
        </>
    );
}

