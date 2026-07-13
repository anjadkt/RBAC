import Header from '../components/Header'
import { Outlet } from 'react-router'
import SideBar from '../components/SideBar'

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Users', to: '/users' },
]

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar links={links} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
