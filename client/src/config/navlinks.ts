import { Boxes, Briefcase, Calendar, Cog, Key, LayoutDashboard, Plane, Shield, Users } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
    },

    {
        title: "Users Management",
        to: "/users",
        icon: Users,
        permission: "user.view",
    },

    {
        title: "Employee Management",
        to: "/employees",
        icon: Briefcase,
        permission: "employee.view",
    },

    {
        title: "Attendance Management",
        to: "/attendance",
        icon: Calendar,
        permission: "attendance.view",
    },

    {
        title: "Leave Management",
        to: "/leave",
        icon: Plane,
        permission: "leave.view",
    },

    {
        title: "Roles Management",
        to: "/roles",
        icon: Shield,
        permission: "rbac.role.view",
    },

    {
        title: "Permissions Management",
        to: "/permissions",
        icon: Key,
        permission: "rbac.permission.view",
    },

    {
        title: "Modules Management",
        to: "/modules",
        icon: Boxes,
        permission: "rbac.module.view",
    },

    {
        title: "Operations Management",
        to: "/operations",
        icon: Cog,
        permission: "rbac.operation.view",
    },
];