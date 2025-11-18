import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@store/queryClient'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@hooks/useAuth'
import DashboardLayout from '@layouts/DashboardLayout'
import { Login, Signup, Forgot } from '@pages/auth/AuthPages'
import AdminDashboard from '@pages/admin/AdminDashboard'
import './index.css'

function Protected({ children, roles }: { children: React.ReactNode, roles?: Array<'admin'|'instructor'|'student'> }){
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />
  return <>{children}</>
}

function AppRouter(){
  return (
    <Routes>
      <Route path="/auth/login" element={<Login/>} />
      <Route path="/auth/signup" element={<Signup/>} />
      <Route path="/auth/forgot" element={<Forgot/>} />

      <Route element={<DashboardLayout/>}>
        <Route path="/admin" element={<Protected roles={['admin']}><AdminDashboard/></Protected>} />
        {/* Placeholders for all modules to ensure routing works */}
        <Route path="/admin/students" element={<Protected roles={['admin']}><div className='p-4 bg-white border rounded-xl'>Students Module</div></Protected>} />
        <Route path="/admin/instructors" element={<Protected roles={['admin']}><div className='p-4 bg-white border rounded-xl'>Instructors Module</div></Protected>} />
        <Route path="/admin/vehicles" element={<Protected roles={['admin']}><div className='p-4 bg-white border rounded-xl'>Vehicles Module</div></Protected>} />
        <Route path="/admin/attendance" element={<Protected roles={['admin','instructor']}><div className='p-4 bg-white border rounded-xl'>Attendance Module</div></Protected>} />
        <Route path="/admin/schedule" element={<Protected roles={['admin']}><div className='p-4 bg-white border rounded-xl'>Schedule Module</div></Protected>} />
        <Route path="/admin/payments" element={<Protected roles={['admin']}><div className='p-4 bg-white border rounded-xl'>Payments Module</div></Protected>} />
        <Route path="/admin/settings" element={<Protected roles={['admin']}><div className='p-4 bg-white border rounded-xl'>Settings</div></Protected>} />
      </Route>

      {/* Instructor and Student placeholders */}
      <Route path="/instructor" element={<Protected roles={['instructor']}><div className='p-6'>Instructor Dashboard</div></Protected>} />
      <Route path="/student" element={<Protected roles={['student']}><div className='p-6'>Student Dashboard</div></Protected>} />

      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
