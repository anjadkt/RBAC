
import RoleComp from './components/RoleComp';
import { FullPageLoader } from '../../components/layout/Loading';
import type { Role } from './components/RoleComp';
import api from '../../utils/api';
import { Toast } from '../../utils/toast';
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export type RoleProps = {
    setMode: any,
    setInitialData: any,
    setIsCreating: any
}

function RoleList(
    { setMode, setInitialData, setIsCreating }: RoleProps
) {

    const [roles, setRoles] = useState<Role[] | null>(null);
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        async function loadRoles() {
            try {
                const { data } = await api.get<{ response: Role[] }>('/role')
                setRoles(data.response)
            } catch (error) {
                console.log("Error while loading roles", error);
                Toast.error("Failed to load roles");
            } finally {
                setIsLoading(false)
            }
        }

        loadRoles()
    }, []);

    return (
        <>
            <div className="mb-6 flex items-center justify-between px-2">
                <h2 className="text-lg font-semibold text-slate-900">Created Roles</h2>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {(roles || []).length} active
                </span>
            </div>

            {(isLoading || !roles) ? (

                <FullPageLoader isLoading={!roles} z="z-0" text="Roles Syncing..." />

            ) : roles.length === 0 ? (

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-sm">
                        <Users className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-lg font-medium text-slate-900">No roles created yet</p>
                    <p className="mt-1 text-sm text-slate-500">Create a role to begin assigning modular system permissions.</p>
                </div>

            ) : (

                <div className="space-y-5">
                    {roles.map((role) => (
                        <RoleComp
                            setInitialData={setInitialData}
                            setMode={setMode}
                            setIsCreating={setIsCreating}
                            key={role._id}
                            role={role}
                        />
                    ))}
                </div>
            )}
        </>
    )
}


export default RoleList