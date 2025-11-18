import { useQuery } from '@tanstack/react-query'
import { dashboard, notificationsAPI } from '@services/storage'
import { Bell, Users, UserCog, CarFront, CalendarCheck, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { data: kpis, isLoading, isError, refetch } = useQuery({ queryKey: ['kpis'], queryFn: dashboard.kpis })
  const { data: notifications } = useQuery({ queryKey: ['notifications'], queryFn: notificationsAPI.list })

  if (isLoading) return <Skeleton />
  if (isError || !kpis) return <ErrorState onRetry={refetch} />

  const cards = [
    { label: 'Active Students', value: kpis.activeStudents, icon: <Users size={18} /> , to: '/admin/students'},
    { label: 'Active Instructors', value: kpis.activeInstructors, icon: <UserCog size={18} />, to: '/admin/instructors' },
    { label: 'Vehicles Available', value: kpis.availableVehicles, icon: <CarFront size={18} />, to: '/admin/vehicles' },
    { label: 'Classes Today', value: kpis.classesToday, icon: <CalendarCheck size={18} />, to: '/admin/schedule' },
    { label: 'Total Revenue', value: `$${kpis.revenue.toLocaleString()}` , icon: <TrendingUp size={18} />, to: '/admin/payments' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Overview</h1>
        <Link to="/notifications" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white"><Bell size={16}/> Notifications</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <Link to={c.to} key={i} className="group p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-white">{c.icon}</div>
            <div>
              <div className="text-sm text-slate-500">{c.label}</div>
              <div className="text-lg font-semibold group-hover:translate-x-0.5 transition">{c.value}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Enrollment Trend</h2>
            <button className="text-sm px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50" onClick={()=>location.reload()}>Refresh</button>
          </div>
          <div className="h-56 flex items-center justify-center text-slate-500">Line chart placeholder</div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h2 className="font-medium mb-2">Notifications</h2>
          <div className="space-y-2">
            {notifications?.slice(0,5).map(n => (
              <div key={n.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-slate-500">{n.message}</div>
              </div>
            )) || <div className="text-sm text-slate-500">No notifications yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

function Skeleton(){
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
    {Array.from({length:5}).map((_,i)=>(<div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse"/>))}
  </div>
}

function ErrorState({ onRetry }: { onRetry: () => any }){
  return <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
    <span>Failed to load dashboard.</span>
    <button onClick={()=>onRetry()} className="px-3 py-1.5 rounded-lg bg-red-600 text-white">Retry</button>
  </div>
}
