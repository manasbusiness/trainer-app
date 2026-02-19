"use client";

import { StudentSidebar } from "@/components/student-sidebar";
import { StudentNavbar } from "@/components/student-navbar";
import { useState } from "react";

interface StudentLayoutClientProps {
    children: React.ReactNode;
    user: {
        name: string;
        email: string;
    } | null;
}

export default function StudentLayoutClient({
    children,
    user
}: StudentLayoutClientProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-vega-gray-50 dark:bg-background">
            <StudentSidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={isMobileSidebarOpen}
                onMobileToggle={setIsMobileSidebarOpen}
            />
            <div className="flex flex-1 flex-col min-w-0">
                <StudentNavbar
                    onToggleSidebar={handleToggleSidebar}
                    userName={user?.name}
                    userEmail={user?.email}
                />
                <main className="flex-1 p-3 md:p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
