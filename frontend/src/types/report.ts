export type ReportType =
  | 'SALES'
  | 'INVENTORY'
  | 'CUSTOMER'
  | 'ORDER'
  | 'FINANCIAL'

export interface Report {
  id: string
  title: string
  type: ReportType
  description: string | null
  data: Record<string, unknown> | null
  createdById: string
  createdAt: string
  updatedAt: string
}
