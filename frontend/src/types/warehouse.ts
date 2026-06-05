export interface Warehouse {
  id: string
  name: string
  code: string
  location: string | null
  capacity: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
