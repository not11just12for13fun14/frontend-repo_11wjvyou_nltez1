// LocalStorage-backed mock API layer with simple persistence and CRUD helpers
import { v4 as uuid } from 'uuid'
import type { User, Student, Instructor, Vehicle, AttendanceRecord, Payment, ClassSchedule, NotificationItem, Role } from '@types/index'

const KEYS = {
  users: 'ds_users',
  students: 'ds_students',
  instructors: 'ds_instructors',
  vehicles: 'ds_vehicles',
  attendance: 'ds_attendance',
  payments: 'ds_payments',
  schedules: 'ds_schedules',
  notifications: 'ds_notifications',
  session: 'ds_session'
}

function initOnce() {
  if (!localStorage.getItem(KEYS.users)) {
    const seedUsers: User[] = [
      { id: uuid(), name: 'Alice Admin', email: 'admin@drive.com', role: 'admin', password: 'admin123' },
      { id: uuid(), name: 'Ian Instructor', email: 'instructor@drive.com', role: 'instructor', password: 'teach123' },
      { id: uuid(), name: 'Sam Student', email: 'student@drive.com', role: 'student', password: 'learn123' },
    ]
    localStorage.setItem(KEYS.users, JSON.stringify(seedUsers))
  }
  for (const key of [KEYS.students, KEYS.instructors, KEYS.vehicles, KEYS.attendance, KEYS.payments, KEYS.schedules, KEYS.notifications]) {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify([]))
  }
}

initOnce()

// Generic helpers
const getAll = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]')
const setAll = <T>(key: string, data: T[]) => localStorage.setItem(key, JSON.stringify(data))

export const auth = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(300)
    const users = getAll<User>(KEYS.users)
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    localStorage.setItem(KEYS.session, JSON.stringify(found))
    return found
  },
  signup: async (name: string, email: string, password: string, role: Role = 'student'): Promise<User> => {
    await delay(300)
    const users = getAll<User>(KEYS.users)
    if (users.some(u => u.email === email)) throw new Error('Email already registered')
    const user: User = { id: uuid(), name, email, password, role }
    users.push(user)
    setAll(KEYS.users, users)
    localStorage.setItem(KEYS.session, JSON.stringify(user))
    return user
  },
  current: (): User | null => {
    const raw = localStorage.getItem(KEYS.session)
    return raw ? JSON.parse(raw) : null
  },
  logout: () => localStorage.removeItem(KEYS.session),
  forgot: async (email: string) => { await delay(400); return { sent: true } }
}

export const studentsAPI = crud<Student>(KEYS.students)
export const instructorsAPI = crud<Instructor>(KEYS.instructors)
export const vehiclesAPI = crud<Vehicle>(KEYS.vehicles)
export const attendanceAPI = crud<AttendanceRecord>(KEYS.attendance)
export const paymentsAPI = crud<Payment>(KEYS.payments)
export const schedulesAPI = crud<ClassSchedule>(KEYS.schedules)
export const notificationsAPI = crud<NotificationItem>(KEYS.notifications)

function crud<T extends { id: string }>(key: string) {
  return {
    list: async (): Promise<T[]> => { await delay(200); return getAll<T>(key) },
    get: async (id: string): Promise<T | undefined> => { await delay(200); return getAll<T>(key).find(i => i.id === id) },
    create: async (item: Omit<T, 'id'>): Promise<T> => {
      await delay(200)
      // @ts-ignore
      const newItem: T = { id: uuid(), ...item }
      const data = getAll<T>(key)
      data.push(newItem)
      setAll<T>(key, data)
      return newItem
    },
    update: async (id: string, patch: Partial<T>): Promise<T> => {
      await delay(200)
      const data = getAll<T>(key)
      const idx = data.findIndex(i => i.id === id)
      if (idx === -1) throw new Error('Not found')
      data[idx] = { ...data[idx], ...patch }
      setAll<T>(key, data)
      return data[idx]
    },
    remove: async (id: string): Promise<void> => {
      await delay(200)
      const data = getAll<T>(key).filter(i => i.id !== id)
      setAll<T>(key, data)
    }
  }
}

export const dashboard = {
  kpis: async () => {
    await delay(250)
    const students = getAll<Student>(KEYS.students)
    const instructors = getAll<Instructor>(KEYS.instructors)
    const vehicles = getAll<Vehicle>(KEYS.vehicles)
    const attendance = getAll<AttendanceRecord>(KEYS.attendance)
    const payments = getAll<Payment>(KEYS.payments)

    const activeStudents = students.filter(s => s.status === 'active').length
    const activeInstructors = instructors.filter(i => i.status === 'active').length
    const availableVehicles = vehicles.filter(v => v.status === 'available').length
    const classesToday = getAll<ClassSchedule>(KEYS.schedules).filter(s => isToday(s.startTime)).length
    const revenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)

    return { activeStudents, activeInstructors, availableVehicles, classesToday, revenue }
  }
}

function delay(ms: number) { return new Promise(res => setTimeout(res, ms)) }
function isToday(iso: string) {
  const d = new Date(iso)
  const t = new Date()
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
}
