import { Users, Mail, Calendar, Shield, UserCog, Eye } from 'lucide-react';
import { usePermissions } from '../../../context/PermissionContext';

export type User = {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
};

export type RoleGroup = {
    roleId: string
    role: string;
    users: User[];
};

type UserRoleListProps = {
    data: RoleGroup[]
    onUpdate: any;
};

export default function UserComp({ data, onUpdate }: UserRoleListProps) {

    const { canAll } = usePermissions();

    const canUpdate = canAll(["users.update", "users.change"]);

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-sm">
                    <Users className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-lg font-medium text-slate-900">No users found</p>
                <p className="mt-1 text-sm text-slate-500">There are currently no users assigned under any role group.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {data.map((group) => (
                <section
                    key={group.role}
                    className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-100/50 transition-all duration-200"
                >
                    {/* Role Group Header Banner */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/75 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 shadow-sm">
                                <Shield className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 tracking-tight">{group.role}</h2>
                                <p className="text-xs text-slate-500">Assigned accounts</p>
                            </div>
                        </div>

                        <span className="rounded-full bg-indigo-50/60 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100/40">
                            {group.users.length} {group.users.length === 1 ? 'member' : 'members'}
                        </span>
                    </div>

                    {/* User Profiles View Grid Matrix */}
                    <div className="p-6 bg-slate-50/20">
                        {group.users.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 py-10 text-center text-xs text-slate-400 font-medium">
                                No active identity nodes mapped onto the {group.role} profile scope level.
                            </div>
                        ) : (
                            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {group.users.map((user) => {
                                    // Compute display initials safely
                                    const initials = user.name
                                        ? user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)
                                        : 'U';

                                    const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });

                                    return (
                                        <div
                                            key={user._id}
                                            className="group relative flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/30 hover:-translate-y-0.5"
                                        >
                                            {/* Primary Profile Summary Region */}
                                            <div className="flex items-start gap-3.5">
                                                {/* Initials Graphics Avatar Layout block */}
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200/50 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-sm">
                                                    {initials}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                        {user.name}
                                                    </h3>
                                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                        <span className="truncate selection:bg-indigo-100">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Center Informational Meta Metrics Divider Ribbon */}
                                            <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 pt-3 text-[11px]">
                                                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400/80" />
                                                    <span>Enrolled {formattedDate}</span>
                                                </div>

                                                {user.isActive ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 border border-emerald-200/40">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 border border-slate-200">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>

                                            {/* Dedicated Bottom Interactive Action Command Toolbar Row */}
                                            <div className="mt-4 flex items-center gap-2 border-t border-slate-100/80 pt-3">
                                                {
                                                    canUpdate &&
                                                    (
                                                        <button
                                                            type="button"
                                                            onClick={() => onUpdate({ ...user, role: group.roleId })}
                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                                                        >
                                                            <UserCog className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                            <span>Update</span>
                                                        </button>
                                                    )
                                                }

                                                <button
                                                    type="button"
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-150 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                                                    title="View Profile Details"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
}