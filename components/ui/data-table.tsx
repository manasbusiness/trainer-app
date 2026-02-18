import * as React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
    children: React.ReactNode;
    className?: string;
}

interface DataTableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface DataTableBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface DataTableRowProps {
    children: React.ReactNode;
    className?: string;
}

interface DataTableHeadProps {
    children: React.ReactNode;
    className?: string;
}

interface DataTableCellProps {
    children: React.ReactNode;
    className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
    return (
        <div className="w-full overflow-auto">
            <table className={cn("w-full border-collapse", className)}>
                {children}
            </table>
        </div>
    );
}

export function DataTableHeader({ children, className }: DataTableHeaderProps) {
    return (
        <thead className={cn("bg-vega-gray-100 border-b border-vega-gray-200 dark:bg-muted/50 dark:border-border", className)}>
            {children}
        </thead>
    );
}

export function DataTableBody({ children, className }: DataTableBodyProps) {
    return (
        <tbody className={className}>
            {children}
        </tbody>
    );
}

export function DataTableRow({ children, className }: DataTableRowProps) {
    return (
        <tr className={cn("border-b border-vega-gray-200 hover:bg-vega-gray-50 transition-colors dark:border-border dark:hover:bg-muted/50", className)}>
            {children}
        </tr>
    );
}

export function DataTableHead({ children, className }: DataTableHeadProps) {
    return (
        <th className={cn("text-left text-xs font-semibold text-vega-gray-700 px-3 py-2 dark:text-muted-foreground", className)}>
            {children}
        </th>
    );
}

export function DataTableCell({ children, className }: DataTableCellProps) {
    return (
        <td className={cn("text-sm text-vega-gray-600 px-3 py-2 dark:text-foreground", className)}>
            {children}
        </td>
    );
}

// Status Badge Component
interface StatusBadgeProps {
    status: "done" | "in-progress" | "pending";
    children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
    const statusStyles = {
        done: "bg-vega-green-50 text-vega-green-400 border-vega-green-200",
        "in-progress": "bg-vega-gray-100 text-vega-gray-600 border-vega-gray-300",
        pending: "bg-vega-orange-50 text-vega-orange-400 border-vega-orange-200",
    };

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
            statusStyles[status]
        )}>
            <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                status === "done" && "bg-vega-green-400",
                status === "in-progress" && "bg-vega-gray-400",
                status === "pending" && "bg-vega-orange-400"
            )} />
            {children}
        </span>
    );
}
