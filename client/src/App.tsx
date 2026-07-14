import { Route, Routes } from 'react-router'
import MainLayout from './layout/MainLayout'
import Login from './features/auth/Login'
import Roles from './features/roles/Roles'
import PublicRoute from './routes/PublicRoute'
import RootRedirect from './routes/RootRedirect'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AccessDenied } from './components/errors/AccessDenied'
import { PermissionRoute } from './routes/PermissionRote'
import { Toaster } from 'react-hot-toast'
import NotFound from './components/errors/NotFound'
import ModuleManagement from './features/module/ModuleManagement'

function App() {
  return (
    <>
      <Routes>

        <Route path="*" element={<NotFound />} />
        <Route path='/root' element={<RootRedirect />} />
        <Route path='/access-denied' element={<AccessDenied />} />

        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

          <Route
            path='/roles'
            element={<PermissionRoute requiredPermission='rbac.role.view'><Roles /></PermissionRoute>}
          />

          <Route
            path="/dashboard"
            element={<PermissionRoute requiredPermission="dashboard.view"><></></PermissionRoute>}
          />

          <Route
            path="/users"
            element={<PermissionRoute requiredPermission="users.view"><></></PermissionRoute>}
          />

          <Route
            path="/employees"
            element={<PermissionRoute requiredPermission="employee.view"><></></PermissionRoute>}
          />

          <Route
            path="/attendance"
            element={<PermissionRoute requiredPermission="attendance.view"><></></PermissionRoute>}
          />

          <Route
            path="/leave"
            element={<PermissionRoute requiredPermission="leave.view"><></></PermissionRoute>}
          />

          <Route
            path="/permissions"
            element={<PermissionRoute requiredPermission="rbac.permission.view"><></></PermissionRoute>}
          />

          <Route
            path="/modules"
            element={<PermissionRoute requiredPermission="rbac.module.view"><ModuleManagement /></PermissionRoute>}
          />

          <Route
            path="/operations"
            element={<PermissionRoute requiredPermission="rbac.operation.view"><></></PermissionRoute>}
          />

        </Route>
      </Routes >

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
    </>

  )
}

export default App
