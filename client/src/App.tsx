import { Navigate, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLayout from './layout/MainLayout'
import Roles from './pages/Roles'

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route element={<MainLayout />}>
          <Route path='/roles' element={<Roles />} />
          <Route path='/permissions' element={<></>} />
        </Route>
      </Routes>
  )
}

export default App
