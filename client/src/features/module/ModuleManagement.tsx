import { useEffect, useState } from 'react';
import { Plus, Boxes } from 'lucide-react';
import api from '../../utils/api';
import { Toast } from '../../utils/toast';
import { FullPageLoader } from '../../components/layout/Loading';
import ModuleComp from './components/ModuleComp';
import { usePermissions } from '../../context/PermissionContext';
import ModuleCreate from './components/ModuleCreate';

export interface ModuleType {
  _id: string;
  name: string;
  code: string;
  createdAt: string;
}

export default function ModuleManagement() {
  const [modules, setModules] = useState<ModuleType[] | null>(null);
  const [open, setOpen] = useState(false);

  const { can } = usePermissions()

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data } = await api.get('/module');
        setModules(data.response);
      } catch (error) {
        console.error('Failed to fetch modules', error);
        Toast.error('Failed to load modules');
      }
    }
    fetchModules();
  }, []);

  const canCreate = can("rbac.module.create");

  return (
    <>
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Configuration</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Modules</h1>
            <p className="mt-2 text-sm text-slate-500">View and manage system modules available for RBAC.</p>
          </div>

          {canCreate && !open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Create New Module
            </button>
          )}

        </div>

        {canCreate && open && (
          <ModuleCreate 
            onClose={() => setOpen(false)} 
            onCreated={(module) => {
              setModules(prev => [module, ...(prev || [])]);
              setOpen(false);
            }} 
          />
        )}

        <div className="mb-4 flex items-center justify-between px-2">
          <h2 className="text-lg font-semibold text-slate-900">Available Modules</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {modules?.length || 0} total
          </span>
        </div>

        {
          (!modules) ? (

            <FullPageLoader isLoading={!modules} z='z-0' text='Modules Loading...' />

          ) : modules.length === 0 ? (

            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200/50 mb-4">
                <Boxes className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-900">No modules found</p>
              <p className="mt-1 text-sm text-slate-500">Get started by creating a new module.</p>
            </div>

          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {modules.map((module) => (
                <ModuleComp module={module} />
              ))}
            </div>
          )
        }
      </div >
    </>
  );
}