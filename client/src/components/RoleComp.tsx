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
  updatedAt: string
}

type PermissionListProps = {
  permissions: Permission[]
}


type RoleCompProps = {
  role: Role
}

export default function RoleComp({ role }: RoleCompProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{role.name}</h2>
            {role.isSystem && (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                System role
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600">{role.description}</p>
        </div>

        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit role
        </button>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Permissions</h3>
          <span className="text-sm text-gray-500">
            {role.permissions.length} assigned
          </span>
        </div>
        <PermissionList permissions={role.permissions} />
      </div>
    </section>
  )
}

export function PermissionList({ permissions }: PermissionListProps) {
  
  if (permissions.length === 0) {
    return <p className="text-sm text-gray-500">No permissions assigned.</p>
  }

  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
      {permissions.map((permission) => (
        <li key={permission._id} className="px-4 py-3">
          <p className="font-medium text-gray-900">{permission.label}</p>
          <p className="mt-1 font-mono text-xs text-blue-700">{permission.name}</p>
          <p className="mt-1 text-sm text-gray-600">{permission.description}</p>
        </li>
      ))}
    </ul>
  )
}
