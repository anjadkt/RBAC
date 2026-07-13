import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLayout from './layout/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route element={<MainLayout />}>
          <Route path='/roles' element={<></>} />
          <Route path='/permissions' element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
