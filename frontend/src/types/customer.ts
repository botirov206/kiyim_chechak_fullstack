export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  company: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
