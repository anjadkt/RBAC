import { useEffect, useState } from 'react'
import RoleComp, { type Role } from '../components/RoleComp'
import api from '../utils/api'

export default function Roles() {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    async function loadRoles() {
      try {
        const { data } = await api.get<{ response: Role[] }>('/roles')
        setRoles(data.response)
      } catch (error) {
        console.log("Error while loading roles",error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRoles()
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Access control</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Roles</h1>
          <p className="mt-2 text-sm text-gray-600">Manage roles and the permissions assigned to them.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create role
        </button>
      </div>

      {isCreating && (<></>)}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Created roles</h2>
        <span className="text-sm text-gray-500">{(roles || []).length} total</span>
      </div>

      {(isLoading || !roles) ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading roles…</div>
      ) : roles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="font-medium text-gray-800">No roles created yet.</p>
          <p className="mt-1 text-sm text-gray-500">Create a role to begin assigning permissions.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {roles.map((role) => (
            <RoleComp key={role._id} role={role} />
          ))}
        </div>
      )}
    </div>
  )
}
