import { useEffect, useState } from 'react';
import { Save, Search, ChevronDown, ShieldCheck, X } from 'lucide-react';
import { Toast } from '../../utils/toast';
import api from '../../utils/api';
import { ButtonLoader } from '../../components/layout/Loading';
import { roleSchema } from './validation';
import type { ModulePermissions } from '../permission/components/PermissionComp';

interface ExistingRole {
    _id?: string;
    name?: string;
    description?: string;
    permissions?: string[];
    isSystem: boolean
}

interface RoleFormProps {
    mode: 'create' | 'edit';
    initialData?: ExistingRole;
    onClose: () => void;
}

type FormState = {
    name: string;
    description: string;
    permissions: string[];
    isSystem: boolean
};

type FormErrors = Partial<Record<'name' | 'description' | 'permissions', string>>;

function buildInitialForm(initialData?: ExistingRole): FormState {
    return {
        name: initialData?.name || '',
        description: initialData?.description || '',
        permissions: (initialData?.permissions || []),
        isSystem: initialData?.isSystem ?? false
    };
}

function RoleForm({ mode, initialData, onClose }: RoleFormProps) {

    const [form, setForm] = useState<FormState>(() => buildInitialForm(initialData));
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [search, setSearch] = useState('');
    const [permissionsGroup, setPermissionsGroup] = useState<null | ModulePermissions[]>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const { data: { response } } = await api.get(`/permission?search=${search}`)
                setPermissionsGroup(response)
            } catch (error) {
                console.error(error);
                Toast.error("Permissions fetching failed!")
            }
        }
        load()
    }, [search]);

    const handleTextChange = (field: 'name' | 'description') => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const togglePermission = (id: string) => {
        setForm((prev) => {
            const exists = prev.permissions.includes(id);
            return {
                ...prev,
                permissions: exists
                    ? prev.permissions.filter((p) => p !== id)
                    : [...prev.permissions, id],
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = roleSchema.safeParse(form);

        if (!result.success) {

            const fieldErrors: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof FormErrors;
                if (!fieldErrors[field]) fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            Toast.error('Please fix the issues');
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const payload = result.data;
            const { data } =
                mode === 'edit' && initialData?._id
                    ? await api.patch(`/role/${initialData._id}`, payload)
                    : await api.post('/role', payload);

            Toast.success(
                data.message || `Role ${mode === 'edit' ? 'updated' : 'created'} successfully`
            );
            onClose();

        } catch (error: any) {

            console.error('Error saving role:', error);

            if (error.response?.status === 409) {
                setErrors((prev) => ({ ...prev, name: 'A role with this name already exists.' }));
                Toast.error('Role name must be unique');
            } else {
                Toast.error(error.response?.data?.message || 'Failed to save role');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalPermissionCount = permissionsGroup?.reduce((acu, val) => acu + val.permissions.length, 0) || 0

    return (
        <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/40 transition-all duration-300">

            {/* Header Profile - Premium Glass/Border Setup */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm shadow-indigo-100/40">
                        <ShieldCheck className="h-5.5 w-5.5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                            {mode === 'edit' ? 'Update Role' : 'Create New Role'}
                        </h2>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                            {mode === 'edit'
                                ? 'Modify role configuration details and system capabilities'
                                : 'Define a custom role context and attach functional keys'}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 p-2 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600 hover:border-slate-300 active:scale-95"
                    aria-label="Close form"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto px-6 py-6 sm:px-8">

                {/* Input Scope Context Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Role Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={handleTextChange('name')}
                            placeholder="e.g. Content Editor"
                            className={`w-full rounded-xl border bg-slate-50/40 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4 ${errors.name
                                ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                                : 'border-slate-200 focus:ring-indigo-600/10 focus:border-indigo-600'
                                }`}
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs font-semibold text-red-600 animate-in fade-in slide-in-from-top-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={form.description}
                            onChange={handleTextChange('description')}
                            placeholder="Briefly describe the operational scope"
                            className={`w-full rounded-xl border bg-slate-50/40 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4 ${errors.description
                                ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                                : 'border-slate-200 focus:ring-indigo-600/10 focus:border-indigo-600'
                                }`}
                        />
                        {errors.description && (
                            <p className="mt-1.5 text-xs font-semibold text-red-600 animate-in fade-in slide-in-from-top-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Permissions Block Framework */}
                <div className="mt-8">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-sm font-bold tracking-wide uppercase text-slate-400">System Capabilities</h3>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">
                                <span className="font-semibold text-indigo-600">{form.permissions.length}</span> of {totalPermissionCount} permissions assigned
                            </p>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search permissions..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                            />
                        </div>
                    </div>

                    {errors.permissions && (
                        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-xs font-semibold text-red-600 animate-in fade-in">
                            {errors.permissions}
                        </div>
                    )}

                    {/* Dynamic Evaluation Stack Context */}
                    {!permissionsGroup ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm font-medium text-slate-400 bg-slate-50/30 animate-pulse">
                            Syncing permissions ledger...
                        </div>
                    ) : permissionsGroup.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm font-medium text-slate-400 bg-slate-50/30">
                            No direct capabilities match your search parameter.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {permissionsGroup.map((group) => {
                                return (
                                    <div
                                        key={group.moduleId}
                                        className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-all duration-200 shadow-sm"
                                    >
                                        {/* Module Accordion/Panel Header Trigger */}
                                        <div className="flex w-full items-center justify-between gap-3 bg-slate-50/70 px-4 py-3.5 border-b border-slate-100 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-800">
                                                    {group.module}
                                                </span>
                                                <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-300/30">
                                                    {group.permissions.length} keys
                                                </span>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                                        </div>

                                        {/* Highly Refactored Premium Checkbox Selection Card Grid Layout */}
                                        <div className="grid gap-3 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white">
                                            {group.permissions.map((perm) => {
                                                const isChecked = form.permissions.includes(perm._id);
                                                return (
                                                    <label
                                                        key={perm._id}
                                                        className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all duration-150 select-none ${isChecked
                                                            ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600'
                                                            : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <div className="flex h-5 items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => togglePermission(perm._id)}
                                                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 transition-all focus:ring-2 focus:ring-indigo-600 focus:ring-offset-0 focus:outline-none"
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span className={`text-xs font-bold transition-colors ${isChecked ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                                                    {perm.label}
                                                                </span>
                                                            </div>
                                                            <code className={`mt-1 inline-block rounded font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide border transition-all ${isChecked
                                                                ? 'bg-indigo-100/60 text-indigo-700 border-indigo-200/50'
                                                                : 'bg-slate-100 text-slate-400 border-slate-200/60'
                                                                }`}>
                                                                {perm.code}
                                                            </code>
                                                            {perm.description && (
                                                                <p className={`mt-1.5 text-xs leading-relaxed line-clamp-2 transition-colors ${isChecked ? 'text-indigo-700/80' : 'text-slate-400'}`}>
                                                                    {perm.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* System Management Flag (True / False Question) */}
                <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/30 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-xl">
                            <h3 className="text-sm font-bold text-slate-800">System Management Scope</h3>
                            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                Should this role be flagged as a strict core system capability? System-managed roles are typically protected from accidental deletion or manual edits by regular administrators.
                            </p>
                        </div>

                        {/* Premium Interactive Toggle Input Group */}
                        <button
                            type="button"
                            onClick={() => setForm(pre => ({ ...pre, isSystem: !pre.isSystem }))}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${form.isSystem ? 'bg-indigo-600' : 'bg-slate-200'
                                }`}
                            role="switch"
                            aria-checked={form.isSystem}
                        >
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.isSystem ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Dynamic Helper Text Labeling */}
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-200/60 pt-3 text-xs">
                        <span className="font-semibold text-slate-500">Payload State:</span>
                        <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold border ${form.isSystem
                                ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                        >
                            isSystem: {form.isSystem ? 'true' : 'false'}
                        </span>
                        {form.isSystem && (
                            <span className="text-amber-600 font-medium animate-in fade-in duration-300">
                                ⚠️ Warning: Setting this to true marks this as un-deletable infrastructure.
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer Actions Context Control Section */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 active:scale-95"
                    >
                        Cancel
                    </button>
                    <ButtonLoader
                        type="submit"
                        isLoading={isSubmitting}
                        loadingText={mode === 'edit' ? 'Updating...' : 'Creating...'}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                    >
                        {!isSubmitting && <Save className="h-3.5 w-3.5" />}
                        {mode === 'edit' ? 'Update Role' : 'Save Role'}
                    </ButtonLoader>
                </div>
            </form >
        </div >
    );
}

export default RoleForm;