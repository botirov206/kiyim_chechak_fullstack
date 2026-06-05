export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderCustomer {
  id: string
  name: string
  company: string | null
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  status: OrderStatus
  totalAmount: string
  notes: string | null
  createdAt: string
  updatedAt: string
  customer?: OrderCustomer
}
