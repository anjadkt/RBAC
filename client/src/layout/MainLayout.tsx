import { Outlet } from 'react-router'
import SideBar from '../components/layout/SideBar'
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {

  const { user, navLinks } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar title={user?.role?.name || "Role"} links={navLinks} />

      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0 md:ml-64">
        <main className="flex-1 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
