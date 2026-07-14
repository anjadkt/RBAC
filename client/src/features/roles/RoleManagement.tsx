import { useState } from 'react'
import { Plus } from 'lucide-react';
import { usePermissions } from '../../context/PermissionContext';
import RoleForm from './RoleForm';
import RoleList from './RoleList';

const initialState = {
  id: "",
  name: "",
  description: "",
  permissions: [],
  isSystem: false
}

export default function RoleManagement() {

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState(initialState);
  const [isCreating, setIsCreating] = useState(false);

  const { can } = usePermissions();

  const canCreate = can("rbac.role.create");

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Access control</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Roles</h1>
            <p className="mt-2 text-sm text-slate-500">Manage roles and the security permissions assigned to them.</p>
          </div>

          {canCreate && !isCreating && (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Create Role
            </button>
          )}
        </div>

        {
          isCreating && canCreate ? (
            <RoleForm
              mode={mode}
              initialData={initialData}
              onClose={() => {
                setInitialData(initialState);
                setMode("create");
                setIsCreating(false);
              }}
            />) :
            (<RoleList
              setIsCreating={setIsCreating}
              setMode={setMode}
              setInitialData={setInitialData}
            />)
        }


      </div>
    </main>
  )
}