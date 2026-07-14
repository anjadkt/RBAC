import type { LucideIcon } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import { ButtonLoader } from './Loading'
import { Toast } from '../../utils/toast'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
// Imported the LogOut icon for the mobile layout view
import { LogOut } from 'lucide-react'

export type NavItem = {
  title: string
  to: string
  icon: LucideIcon
  permission?: string
}

type SideBarProps = {
  links: NavItem[]
  title: string
}

function SideBar({ links, title }: SideBarProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.get("/auth/logout");
      await logout();

      Toast.success("Logout Success");
      navigate("/login");
    } catch (error) {
      Toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside
      className="fixed z-50 bg-slate-900 border-slate-800 text-slate-200 transition-all duration-300
        /* Mobile: Bottom Row Setup */
        bottom-0 left-0 right-0 h-16 border-t px-4 flex items-center justify-between gap-2
        /* Desktop: Left Column Setup */
        md:top-0 md:bottom-0 md:left-0 md:h-screen md:w-64 md:border-r md:border-t-0 md:p-5 md:flex-col md:items-stretch md:justify-start"
    >
      {/* Title Header - Hidden on Mobile */}
      <div className="hidden md:flex items-center gap-2 mb-8 px-2">
        <h2 className="text-base font-semibold tracking-wide text-slate-100">
          {title}
        </h2>
      </div>

      {/* Navigation Links Layer */}
      <nav className="flex-1 md:w-full md:flex-initial">
        <ul className="flex flex-row w-full justify-around items-center md:flex-col md:space-y-1">
          {links.map((link) => {
            const Icon = link.icon

            return (
              <li key={link.to} className="w-full flex justify-center md:block">
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `
                    flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out group relative
                    md:justify-start md:w-full
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                  <span className="hidden md:inline truncate">
                    {link.title}
                  </span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Adaptable Responsive Logout Container */}
      <div className="flex shrink-0 items-center justify-center md:w-full md:mt-auto md:pt-4 md:border-t md:border-slate-800">
        <ButtonLoader
          isLoading={loading}
          disabled={loading}
          onClick={handleLogout}
          type="button"
          loadingText="" // Keeps mobile view clean without text pushing out layout widths
          className="flex items-center justify-center gap-3 rounded-xl transition-all duration-200 outline-none
            /* Mobile View Style: Clean Subtle Icon Box */
            w-11 h-11 text-slate-400 hover:bg-red-500/15 hover:text-red-400
            /* Desktop View Style: Full Width Textured Button */
            md:w-full md:h-auto md:px-4 md:py-2.5 md:bg-red-600/10 md:text-red-400 md:hover:bg-red-600 md:hover:text-white"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="hidden md:inline text-sm font-semibold tracking-wide">
            Logout
          </span>
        </ButtonLoader>
      </div>
    </aside>
  )
}

export default SideBar