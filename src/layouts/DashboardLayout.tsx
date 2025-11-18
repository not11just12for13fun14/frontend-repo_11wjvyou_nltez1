import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Bell, LayoutDashboard, Users, UserCog, CarFront, Calendar, Receipt, CheckSquare, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@hooks/useAuth'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', roles: ['admin'] },
    { to: '/admin/students', icon: <Users size={18} />, label: 'Students', roles: ['admin'] },
    { to: '/admin/instructors', icon: <UserCog size={18} />, label: 'Instructors', roles: ['admin'] },
    { to: '/admin/vehicles', icon: <CarFront size={18} />, label: 'Vehicles', roles: ['admin'] },
    { to: '/admin/attendance', icon: <CheckSquare size={18} />, label: 'Attendance', roles: ['admin','instructor'] },
    { to: '/admin/schedule', icon: <Calendar size={18} />, label: 'Schedule', roles: ['admin'] },
    { to: '/admin/payments', icon: <Receipt size={18} />, label: 'Payments', roles: ['admin'] },
    { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings', roles: ['admin'] },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/student'} className="font-semibold text-slate-800">DrivePro</Link>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="p-2 rounded-lg hover:bg-slate-100 transition"><Bell size={18} /></Link>
            <button onClick={() => { logout(); navigate('/auth/login') }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:opacity-90"><LogOut size={16}/> Logout</button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="bg-white border border-slate-200 rounded-xl shadow-sm p-2">
            {nav.filter(i => !user || (i.roles as readonly string[]).includes(user.role)).map(item => (
              <Link key={item.to} to={item.to} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
