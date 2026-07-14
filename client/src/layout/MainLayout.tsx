import Header from '../components/layout/Header'
import { Outlet } from 'react-router'
import SideBar from '../components/layout/SideBar'
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {

  const { user, navLinks } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar title={user.role.name} links={navLinks} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
