// Global TypeScript types for the Driving School Management System
export type Role = 'admin' | 'instructor' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  password: string
}

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  packageName: string
  totalSessions: number
  completedSessions: number
  assignedInstructorId?: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  assignedClasses: number
  createdAt: string
}

export interface Vehicle {
  id: string
  model: string
  plateNumber: string
  capacity: number
  assignedInstructorId?: string
  status: 'available' | 'in-service' | 'maintenance'
  createdAt: string
}

export type AttendanceStatus = 'attended' | 'missed' | 'pending'

export interface AttendanceRecord {
  id: string
  studentId: string
  instructorId: string
  classId: string
  timestamp: string
  status: AttendanceStatus
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  status: 'pending' | 'completed' | 'refunded'
  method: 'card' | 'cash' | 'bank'
  timestamp: string
  notes?: string
}

export interface ClassSchedule {
  id: string
  title: string
  studentId: string
  instructorId: string
  vehicleId?: string
  startTime: string
  endTime: string
  location: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  role: Role | 'all'
  timestamp: string
}
