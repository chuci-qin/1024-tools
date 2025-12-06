"use client";

import { Lock } from "lucide-react";

interface NotLoggedInProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function NotLoggedIn({
  title = "You are not logged in",
  message = "Please log in to access this feature",
  icon,
  className = "",
}: NotLoggedInProps) {
  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className="text-center">
        <div className="mb-4">
          {icon || (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/60 border border-white/10">
              <Lock className="h-6 w-6 text-white/40" />
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60">{message}</p>
      </div>
    </div>
  );
}

