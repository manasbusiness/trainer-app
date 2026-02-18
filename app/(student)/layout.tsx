"use client";

import { StudentSidebar } from "@/components/student-sidebar";
import { StudentNavbar } from "@/components/student-navbar";
import { useState } from "react";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        // On mobile, toggle the sheet
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            // On desktop, collapse/expand
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
                    userName="John Doe"
                    userEmail="john@example.com"
                />
                <main className="flex-1 p-3 md:p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
