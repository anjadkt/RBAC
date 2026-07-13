import { NavLink } from 'react-router'

type NavItem = {
  label: string
  to: string
}

type SideBarProps = {
  links: NavItem[]
}

function SideBar({ links }: SideBarProps) {
  return (
    <aside className="min-h-screen w-46 bg-gray-900 p-4 text-white">
      <h2 className="mb-8 text-lg font-semibold">Admin Panel</h2>

      <nav>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar
