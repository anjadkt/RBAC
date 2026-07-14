import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'

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

  return (
    <aside
      className="fixed z-50 bg-slate-900 border-slate-800 text-slate-200 transition-all duration-300
        bottom-0 left-0 right-0 h-16 border-t px-4 flex items-center justify-between
        md:top-0 md:bottom-0 md:left-0 md:h-screen md:w-64 md:border-r md:border-t-0 md:p-5 md:flex-col md:items-stretch md:justify-start"
    >

      <div className="hidden md:flex items-center gap-2 mb-8 px-2">
        <h2 className="text-base font-semibold tracking-wide text-slate-100">
          {title}
        </h2>
      </div>

      <nav className="w-full">
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

    </aside>
  )
}

export default SideBar