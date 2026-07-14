import { ShieldCheck, Lock, Edit2 } from 'lucide-react'

export type Permission = {
  _id: string
  name: string
  label: string
  description: string
}

export type Role = {
  _id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: string
}

type PermissionListProps = {
  permissions: Permission[]
}

type RoleCompProps = {
  role: Role
  setMode: any,
  setInitialData: any,
  setIsCreating: any
}

export default function RoleComp(
  {
    role,
    setMode,
    setInitialData,
    setIsCreating
  }: RoleCompProps
) {

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100 transition-all duration-200 hover:shadow-md hover:shadow-slate-200/30">

      {/* Visual Accent Highlight for System Roles */}
      <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${role.isSystem ? 'bg-indigo-600' : 'bg-slate-300'}`} />

      <div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {/* Accent Icon */}
          <div className={`mt-0.5 rounded-lg p-2 ${role.isSystem ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
            {role.isSystem ? <Lock className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{role.name}</h2>
              {role.isSystem && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  System Role
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">{role.description}</p>
          </div>
        </div>

        {/* Edit Role Action */}
        <button
          onClick={() => {
            setMode("edit");
            setInitialData({ ...role, permissions: role.permissions.map(p => p._id) })
            setIsCreating(true);
          }}
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:self-start shrink-0"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Role
        </button>
      </div>

      {/* Permissions Section Wrapper */}
      <div className="mt-8 border-t border-slate-100 pt-6 pl-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-400">Permissions</h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200/50">
            {role.permissions.length} assigned
          </span>
        </div>

        {/* Render Refactored Permission Grid */}
        <PermissionList permissions={role.permissions} />
      </div>
    </section>
  )
}

export function PermissionList({ permissions }: PermissionListProps) {
  if (permissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
        <p className="text-xs text-slate-400 italic">No direct permissions assigned to this role scope.</p>
      </div>
    )
  }

  return (
    /* Redesigned to render as an elegant, compact, multi-column grid instead of a heavy vertical list */
    <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {permissions.map((permission) => (
        <li
          key={permission._id}
          className="group relative flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50 hover:border-slate-200/80"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                {permission.label}
              </span>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 border border-slate-200/60 uppercase shrink-0">
                {permission.name}
              </code>
            </div>

            <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {permission.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}