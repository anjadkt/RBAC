import React, { type ButtonHTMLAttributes } from 'react';


interface FullPageLoaderProps {
    isLoading: boolean;
    text?: string;
    z: string
}

interface ButtonLoaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
    isLoading,
    text = 'Loading...',
    z = "z-30"
}) => {
    if (!isLoading) return null;

    return (
        <div className={`fixed inset-0 ${z} flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300`}>
            <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200/30 border-t-blue-500"></div>
                <div
                    className="absolute h-10 w-10 animate-spin rounded-full border-4 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent"
                    style={{ animationDirection: 'reverse' }}
                ></div>
            </div>
            <span className="mt-4 text-sm font-semibold tracking-wider text-white uppercase animate-pulse">
                {text}
            </span>
        </div>
    );
};

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
    isLoading,
    loadingText = 'Processing...',
    children,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            type="button"
            disabled={disabled || isLoading}
            className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg shadow-md transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed hover:bg-blue-700 ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
};