import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../../utils/api';
import { Toast } from '../../../utils/toast';
import { ButtonLoader } from '../../../components/layout/Loading';
import type { ModuleType } from '../../module/ModuleManagement';
import { permissionSchema } from '../validation';

interface PermissionType {
    _id: string;
    module: string;
    operation: string;
    label: string;
    description?: string;
}

interface PermissionCreateProps {
    onClose: () => void;
    onCreated: (permission: PermissionType) => void;
}

type FormState = {
    module: string;
    operation: string;
    label: string;
    description: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;


type OperationType = {
    _id: string;
    name: string;
    code: string;
    createdAt: string;
}

const initialForm: FormState = {
    module: '',
    operation: '',
    label: '',
    description: '',
};

export default function PermissionCreate({ onClose, onCreated }: PermissionCreateProps) {
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [modules, setModules] = useState<ModuleType[]>([]);
    const [operations, setOperations] = useState<OperationType[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            setIsLoadingOptions(true);
            try {
                const [moduleRes, operationRes] = await Promise.all([
                    api.get('/module'),
                    api.get('/operation'),
                ]);
                setModules(moduleRes.data.response || []);
                setOperations(operationRes.data.response || []);
            } catch (error) {
                console.error('Error fetching module/operation options:', error);
                Toast.error('Failed to load modules or operations');
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchOptions();
    }, []);

    const handleChange = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = permissionSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof FormState;
                if (!fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            });
            setErrors(fieldErrors);
            Toast.error('Please fix the Issues');
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const { data } = await api.post('/permission', result.data);
            Toast.success(data.message || 'Permission created successfully');
            onCreated(data.response);
        } catch (error: any) {
            console.error('Error creating permission:', error);

            if (error.response?.status === 409) {
                setErrors((prev) => ({ ...prev, label: 'A permission with this label already exists.' }));
                Toast.error('Permission label must be unique');
            } else {
                Toast.error(error.response?.data?.message || 'Failed to create permission');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-200/20 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Create New Permission</h2>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="module" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Module
                        </label>
                        <select
                            id="module"
                            value={form.module}
                            onChange={handleChange('module')}
                            disabled={isLoadingOptions}
                            className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:ring-2 disabled:opacity-60 ${errors.module
                                ? 'border-red-400 focus:ring-red-500'
                                : 'border-slate-200 focus:ring-indigo-600 focus:border-transparent'
                                }`}
                        >
                            <option value="">
                                {isLoadingOptions ? 'Loading modules...' : 'Select a module'}
                            </option>
                            {modules.map((module: any) => (
                                <option key={module._id} value={module._id}>
                                    {module.code}
                                </option>
                            ))}
                        </select>
                        {errors.module && (
                            <p className="mt-1.5 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.module}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="operation" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Operation
                        </label>
                        <select
                            id="operation"
                            value={form.operation}
                            onChange={handleChange('operation')}
                            disabled={isLoadingOptions}
                            className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:ring-2 disabled:opacity-60 ${errors.operation
                                ? 'border-red-400 focus:ring-red-500'
                                : 'border-slate-200 focus:ring-indigo-600 focus:border-transparent'
                                }`}
                        >
                            <option value="">
                                {isLoadingOptions ? 'Loading operations...' : 'Select an operation'}
                            </option>
                            {operations.map((operation: any) => (
                                <option key={operation._id} value={operation._id}>
                                    {operation.code}
                                </option>
                            ))}
                        </select>
                        {errors.operation && (
                            <p className="mt-1.5 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.operation}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="label" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Label
                    </label>
                    <input
                        id="label"
                        type="text"
                        value={form.label}
                        onChange={handleChange('label')}
                        placeholder="e.g. View Users"
                        className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${errors.label
                            ? 'border-red-400 focus:ring-red-500'
                            : 'border-slate-200 focus:ring-indigo-600 focus:border-transparent'
                            }`}
                    />
                    {errors.label && (
                        <p className="mt-1.5 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.label}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Description <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={handleChange('description')}
                        placeholder="Briefly describe what this permission allows"
                        rows={3}
                        className={`w-full resize-none rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${errors.description
                            ? 'border-red-400 focus:ring-red-500'
                            : 'border-slate-200 focus:ring-indigo-600 focus:border-transparent'
                            }`}
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                        {errors.description ? (
                            <p className="text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.description}</p>
                        ) : (
                            <span />
                        )}
                        <span className="text-xs text-slate-400">{form.description.length}/255</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <ButtonLoader
                        type="submit"
                        isLoading={isSubmitting}
                        loadingText="Creating..."
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {!isSubmitting && <Save className="h-4 w-4" />}
                        Save Permission
                    </ButtonLoader>
                </div>
            </form>
        </div>
    );
}