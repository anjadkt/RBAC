import { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../../utils/api';
import { Toast } from '../../../utils/toast';
import { ButtonLoader } from '../../../components/layout/Loading';
import type { ModuleType } from '../ModuleManagement';

interface ModuleCreateProps {
    onClose: () => void;
    onCreated: (module: ModuleType) => void;
}

export default function ModuleCreate({ onClose, onCreated }: ModuleCreateProps) {

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeError, setCodeError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !code.trim()) {
            Toast.error("Name and Code are required");
            return;
        }

        setIsSubmitting(true);
        setCodeError(null);

        try {
            const { data } = await api.post('/module', { name, code });

            Toast.success(data.message || "Module created successfully");
            onCreated(data.response);

        } catch (error: any) {
            console.error("Error creating module:", error);

            if (error.response?.status === 409) {
                setCodeError("A module with this code already exists.");
                Toast.error("Module code must be unique");
            } else {
                Toast.error(error.response?.data?.message || "Failed to create module");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-200/20 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Create New Module</h2>
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
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Module Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Employee Management"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Module Code
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                if (codeError) setCodeError(null);
                            }}
                            placeholder="e.g. employee"
                            className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${codeError
                                ? 'border-red-400 focus:ring-red-500'
                                : 'border-slate-200 focus:ring-indigo-600 focus:border-transparent'
                                }`}
                        />
                        {codeError && (
                            <p className="mt-1.5 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{codeError}</p>
                        )}
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
                        Save Module
                    </ButtonLoader>
                </div>
            </form>
        </div>
    );
}