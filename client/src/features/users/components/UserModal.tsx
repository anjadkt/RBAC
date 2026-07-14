import { useEffect, useState } from 'react';
import { X, User, Mail, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../../utils/api';
import { Toast } from '../../../utils/toast';
import { ButtonLoader } from '../../../components/layout/Loading';


export type User = {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
    role: string;
};

type UserModalProps = {
    isOpen: boolean;
    mode: 'create' | 'update';
    user?: User | null;
    onClose: () => void;
    onSave: any;
};

function UserModal({ isOpen, mode, user, onClose, onSave }: UserModalProps) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [availableRoles, setAvailableRoles] = useState<{ _id: string, name: string, level: number }[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        if (!isOpen) return;

        async function fetchSystemRoles() {
            setIsLoadingRoles(true);
            try {
                const { data } = await api.get('/role');
                setAvailableRoles(data.response.map((v: any) => ({ _id: v._id, name: v.name, level: v.level })));
            } catch (error) {
                console.error('Failed to sync system roles matrix:', error);
                Toast.error("Failed to load roles!");
            } finally {
                setIsLoadingRoles(false);
            }
        }

        fetchSystemRoles();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && mode === 'update' && user) {

            setName(user.name || '');
            setEmail(user.email || '');
            setRole(user.role || '');
            setIsActive(user.isActive ?? true);
        } else if (isOpen && mode === 'create') {

            setName('');
            setEmail('');
            setRole('');
            setIsActive(true);
        }
    }, [isOpen, mode, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !role || !email) {
            Toast.error('Please resolve issues.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = mode === 'create'
                ? { name, email, role }
                : { name, role, isActive };

            mode === "create"
                ? await api.post("/users", payload)
                : await api.patch(`/users/${user?._id}`, payload);

            Toast.success(`User Profile ${mode === "create" ? "Created" : "Updated"} Successfully!`);
            onSave();
            onClose();
        } catch (error) {
            console.error('Operation execution faulted:', error);
            Toast.error("Failed to save user!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Layer Blur */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Box Window Container */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">

                {/* Close Action Switch */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header Context Banner */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                        {mode === 'create' ? 'Provision Account Profile' : 'Modify Access Profile'}
                    </h2>
                </div>

                {/* Main Dynamic Context Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name Parameter Field */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
                        <div className="relative mt-1.5">
                            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Alexander Vance"
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                            />
                        </div>
                    </div>

                    {/* Email Parameter Field (Conditionally Rendered or Disabled) */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Corporate Email</label>
                        <div className="relative mt-1.5">
                            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                required
                                disabled={mode === 'update'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 ${mode === 'update'
                                    ? 'border-slate-200/80 bg-slate-50 text-slate-400 cursor-not-allowed selection:bg-transparent'
                                    : 'border-slate-200 bg-white text-slate-900 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600'
                                    } `}
                            />
                        </div>
                    </div>

                    {/* Architectural Role Dropdown Field Selection */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">System Capability Role</label>
                        <div className="relative mt-1.5">
                            <Shield className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <select
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                disabled={isLoadingRoles}
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-400"
                            >
                                <option value="" disabled>Select internal directory assignment...</option>
                                {availableRoles.map((roleName) => (
                                    <option key={roleName._id} value={roleName._id}>{`${roleName.name} -${roleName.level} `}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Cluster Lifecycle Toggle Switch (Rendered ONLY in update mode) */}
                    {mode === 'update' && (
                        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <CheckCircle2 className={`h - 3.5 w - 3.5 ${isActive ? 'text-emerald-500' : 'text-slate-300'} `} />
                                    Operational Account Status
                                </span>
                            </div>

                            {/* Standard Tailwind Custom Accessible Checkbox Toggle Switch */}
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20" />
                            </label>
                        </div>
                    )}

                    {/* Command Button Bar Panel Footer */}
                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 active:scale-95 focus:outline-none"
                        >
                            Cancel
                        </button>

                        <ButtonLoader
                            isLoading={isSubmitting}
                            type="submit"
                            disabled={isSubmitting || isLoadingRoles}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : null}
                            <span>{mode === 'create' ? 'Provision Identity' : 'Commit Profiling Changes'}</span>
                        </ButtonLoader>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserModal;