import React from 'react';
import { Link } from 'react-router';

export const AccessDenied: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

            <div className="relative max-w-md w-full bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 text-center shadow-2xl">
                {/* Shield Icon with glowing ring */}
                <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <svg
                        className="w-8 h-8 text-rose-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>

                {/* Error Code & Heading */}
                <span className="text-xs font-bold tracking-widest uppercase text-rose-500">
                    Error 403
                </span>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                    Access Denied
                </h1>

                {/* Description */}
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                    You don't have permission to access this page. Please make sure you are logged in with the correct account or contact your administrator.
                </p>

                {/* Action Button */}
                <div className="mt-8">
                    <Link
                        to="/root"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all duration-150"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};