import { useEffect, useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import type { ModulePermissions } from './components/PermissionComp';
import { FullPageLoader } from '../../components/layout/Loading';
import PermissionComp from './components/PermissionComp';
import PermissionCreate from './components/PermissionCreate';
import { usePermissions } from '../../context/PermissionContext';
import api from '../../utils/api';
import { Toast } from '../../utils/toast';


function PermissionManagement() {

    const [permissions, setPermissions] = useState<ModulePermissions[] | null>(null);
    const [open, setOpen] = useState(false);

    const { can } = usePermissions();

    const totalPermissionsCount = permissions?.reduce(
        (acc, curr) => acc + (curr.permissions?.length || 0), 0
    ) || 0;

    const handleOnCreate = (newPermission: any) => {

        setPermissions(prev =>
            prev?.map(group =>
                group.moduleId === newPermission.moduleId
                    ? {
                        ...group,
                        permissions: [
                            ...group.permissions,
                            newPermission,
                        ],
                    }
                    : group
            ) || []
        );

        setOpen(false);
    }

    useEffect(() => {
        async function fetchPermissions() {
            try {
                const { data } = await api.get('/permission');
                setPermissions(data.response);
            } catch (error) {
                console.error('Failed to fetch permission', error);
                Toast.error('Failed to load permissions');
            }
        }
        fetchPermissions();
    }, []);

    const canCreate = can("rbac.permission.create");

    return (
        <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/20 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Configuration</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Permissions</h1>
                        <p className="mt-2 text-sm text-slate-500">View and manage RBAC permissions.</p>
                    </div>

                    {canCreate && !open && (
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 architecture-btn"
                        >
                            <Plus className="h-5 w-5" />
                            Create New Permission
                        </button>
                    )}
                </div>

                {canCreate && open && (
                    <PermissionCreate
                        onClose={() => setOpen(false)}
                        onCreated={handleOnCreate}
                    />
                )}

                <div className="mb-6 flex items-center justify-between px-2">
                    <h2 className="text-lg font-semibold text-slate-900">System Permissions & Modules</h2>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {totalPermissionsCount} keys active
                    </span>
                </div>

                {
                    (!permissions) ? (

                        <FullPageLoader isLoading={!permissions} z="z-0" text="Permissions Syncing..." />

                    ) : permissions.length === 0 ? (

                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-sm">
                                <ShieldAlert className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-lg font-medium text-slate-900">No permissions registered</p>
                            <p className="mt-1 text-sm text-slate-500">There are no operational safety layers instantiated yet.</p>
                        </div>
                    ) : (

                        <div className="space-y-6">
                            {permissions.map((moduleData) => (
                                <PermissionComp
                                    key={moduleData.module}
                                    data={moduleData}
                                />
                            ))}
                        </div>
                    )
                }
            </div>
        </main>
    );
}

export default PermissionManagement;