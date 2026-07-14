import { useEffect, useState } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { FullPageLoader } from '../../components/layout/Loading';
import { usePermissions } from '../../context/PermissionContext';
import api from '../../utils/api';
import { Toast } from '../../utils/toast';
import UserComp, { type RoleGroup } from './components/UserComp';
import UserModal, { type User } from './components/UserModal';

function UserManagement() {

    const [roleGroups, setRoleGroups] = useState<RoleGroup[] | null>(null);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mode, setMode] = useState<"update" | "create">("create");
    const [user, setUser] = useState<User | null>(null);

    const { can } = usePermissions();

    const onUpdate = (user: User) => {
        setMode("update");
        setUser(user);
        setOpen(true);
    };

    async function fetchUsers() {
        try {
            const { data } = await api.get('/users');
            setRoleGroups(data.response);
        } catch (error) {
            console.error('Failed to fetch user mapping framework', error);
            Toast.error('Failed to load user directory matrix');
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const canCreate = can("users.create");

    const totalUsersCount = roleGroups?.reduce(
        (acc, curr) => acc + (curr.users?.length || 0), 0
    ) || 0;

    return (
        <>
            <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">

                    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/20 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Identity Registry</p>
                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
                            <p className="mt-2 text-sm text-slate-500">Monitor active accounts & profiles.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                            {roleGroups && roleGroups.length > 0 && (
                                <div className="relative w-full sm:w-64 shrink-0">
                                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Filter profiles..."
                                        className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                                    />
                                </div>
                            )}

                            {canCreate && !open && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(true);
                                        setMode("create");
                                        setUser(null);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 architecture-btn whitespace-nowrap"
                                >
                                    <Plus className="h-5 w-5" />
                                    Create User Account
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between px-2">
                        <h2 className="text-lg font-semibold text-slate-900">Configured Role Directories</h2>
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {totalUsersCount} Modules
                        </span>
                    </div>

                    {
                        (!roleGroups) ? (

                            <FullPageLoader isLoading={!roleGroups} z="z-0" text="Users Syncing..." />

                        ) : roleGroups.length === 0 ? (

                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-sm">
                                    <Users className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-lg font-medium text-slate-900">No identities registered</p>
                                <p className="mt-1 text-sm text-slate-500">There are no functional user parameters instantiated on the cluster database yet.</p>
                            </div>
                        ) : (

                            <div className="space-y-6">
                                <UserComp
                                    data={roleGroups}
                                    onUpdate={onUpdate}
                                />
                            </div>
                        )
                    }
                </div>
            </main>

            {
                canCreate && open &&
                (<UserModal
                    user={user}
                    isOpen={open}
                    mode={mode}
                    onClose={() => setOpen(false)}
                    onSave={fetchUsers}
                />)
            }
        </>

    );
}

export default UserManagement;