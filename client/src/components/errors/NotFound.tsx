import React from 'react';
import { Link } from 'react-router';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background glow effects matching the premium theme */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative max-w-md w-full bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 text-center shadow-2xl">
                {/* Floating Compass/Map Icon with glowing ring */}
                <div className="mx-auto w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce [animation-duration:3s]">
                    <svg
                        className="w-8 h-8 text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.75"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 13.5L15 9l-4.5 4.5z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 9l-1.5 6-3-1.5 4.5-4.5z"
                        />
                    </svg>
                </div>

                {/* Error Code & Heading */}
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
                    Error 404
                </span>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                    Page Not Found
                </h1>

                {/* Description */}
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
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

export default NotFound;