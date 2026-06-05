export interface Product {
  id: string
  sku: string
  name: string
  description: string | null
  price: string
  category: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WarehouseSummary {
  id: string
  name: string
  code: string
}

export interface InventoryItem {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  minStock: number
  createdAt: string
  updatedAt: string
  product: Product
  warehouse: WarehouseSummary
}

export interface InventoryStatusSummary {
  totalItems: number
  inStock: number
  lowStock: number
  outOfStock: number
}
