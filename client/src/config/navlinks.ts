import { Boxes, Briefcase, Calendar, Cog, Key, LayoutDashboard, Plane, Shield, Users } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
    },

    {
        title: "Users",
        to: "/users",
        icon: Users,
        permission: "users.view",
    },

    {
        title: "Employee",
        to: "/employees",
        icon: Briefcase,
        permission: "employee.view",
    },

    {
        title: "Attendance",
        to: "/attendance",
        icon: Calendar,
        permission: "attendance.view",
    },

    {
        title: "Leave",
        to: "/leave",
        icon: Plane,
        permission: "leave.view",
    },

    {
        title: "Roles",
        to: "/roles",
        icon: Shield,
        permission: "rbac.role.view",
    },

    {
        title: "Permissions",
        to: "/permissions",
        icon: Key,
        permission: "rbac.permission.view",
    },

    {
        title: "Modules",
        to: "/modules",
        icon: Boxes,
        permission: "rbac.module.view",
    },

    {
        title: "Operations",
        to: "/operations",
        icon: Cog,
        permission: "rbac.operation.view",
    },
];