import { Shield } from 'lucide-react';

export interface Permission {
    _id: string;
    code: string;
    label: string;
    description: string;
    createdAt: string;
}

export interface ModulePermissions {
    module: string;
    permissions: Permission[];
    moduleId: string
}

export default function PermissionComp({ data }: { data: ModulePermissions }) {
    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">{data.module}</h3>

            <div className="grid gap-4 sm:grid-cols-2">
                {data.permissions.map(perm => (
                    <div key={perm._id} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100/80">
                        <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-800">{perm.label}</span>
                            <Shield className="h-4 w-4 text-slate-400" />
                        </div>
                        <code className="self-start rounded bg-white px-2 py-1 text-xs font-mono font-medium text-slate-600 border border-slate-200">
                            {perm.code}
                        </code>
                        <p className="text-sm text-slate-500 mt-1">{perm.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}