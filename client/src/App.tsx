import { Navigate, Route, Routes } from 'react-router'
import MainLayout from './layout/MainLayout'
import Login from './features/auth/Login'
import Roles from './features/roles/Roles'
import PublicRoute from './routes/PublicRoute'
import RootRedirect from './routes/RootRedirect'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AccessDenied } from './components/errors/AccessDenied'
import { PermissionRoute } from './routes/PermissionRote'

function App() {
  return (
    <Routes>

      <Route path="*" element={<Navigate to="/root" replace />} />
      <Route path='/root' element={<RootRedirect />} />
      <Route path='/access-denied' element={<AccessDenied />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

        <Route
          path='/roles'
          element={<PermissionRoute requiredPermission='rbac.role.view'><Roles /></PermissionRoute>}
        />
        <Route path='/permissions' element={<></>} />

      </Route>
    </Routes >
  )
}

export default App
