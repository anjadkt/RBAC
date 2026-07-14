import { ChevronRight, Component } from "lucide-react";
import type { ModuleType } from "../ModuleManagement";


export default function ModuleComp({ module }: { module: ModuleType }) {
    return (
        <div
            key={module._id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200"
        >
            <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-indigo-50 transition-transform duration-500 group-hover:scale-150 group-hover:bg-indigo-100/50"></div>

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Component className="h-6 w-6" />
                </div>
                <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 backdrop-blur-sm">
                    Active
                </span>
            </div>

            <div className="relative z-10 mt-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {module.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs font-mono font-medium text-slate-600">
                        {module.code}
                    </code>
                </div>
            </div>

            <div className="relative z-10 mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Created {new Date(module.createdAt).toLocaleDateString()}</span>
                <button className="flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                    Update
                    <ChevronRight className="ml-1 h-4 w-4" />
                </button>
            </div>
        </div>
    )
}