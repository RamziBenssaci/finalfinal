// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// User Types
export interface User {
  id: number
  name: string
  email: string
  phone: string
  location: string
  suite_number?: string
  avatar?: string
  created_at: string
  updated_at: string
}

// Address Types
export interface Address {
  id: number
  name: string
  street: string
  city: string
  state: string
  country: string
  postal_code: string
  phone: string
  is_default: boolean
  type: 'home' | 'work' | 'other'
}

// Delivery Request Types
export interface DeliveryRequest {
  id: number
  pickup_address: Address
  delivery_address: Address
  package_details: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    value: number
    description: string
  }
  delivery_date: string
  delivery_time: string
  special_instructions?: string
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled'
  tracking_number?: string
  cost: number
  created_at: string
}

// Wallet Types
export interface WalletTransaction {
  id: number
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund'
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface Wallet {
  balance: number
  currency: string
  transactions: WalletTransaction[]
}

// Membership Types
export interface Membership {
  id: number
  name: string
  type: 'basic' | 'premium' | 'enterprise'
  price: number
  currency: string
  features: string[]
  expires_at: string
  is_active: boolean
}

// Form Types
export interface DeliveryRequestForm {
  pickup_address_id?: number
  new_pickup_address?: Omit<Address, 'id'>
  delivery_address_id?: number
  new_delivery_address?: Omit<Address, 'id'>
  package_weight: number
  package_length: number
  package_width: number
  package_height: number
  package_value: number
  package_description: string
  delivery_date: string
  delivery_time: string
  special_instructions?: string
}

export interface UserProfileForm {
  name: string
  email: string
  phone: string
  location: string
}

export interface PasswordChangeForm {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface AddressForm {
  name: string
  street: string
  city: string
  state: string
  country: string
  postal_code: string
  phone: string
  type: 'home' | 'work' | 'other'
  is_default: boolean
}