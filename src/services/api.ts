import { 
  ApiResponse, 
  User, 
  Address, 
  DeliveryRequest, 
  Wallet, 
  Membership,
  DeliveryRequestForm,
  UserProfileForm,
  PasswordChangeForm,
  AddressForm
} from '@/types/api'

const mockUser: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+964 750 123 4567",
  location: "Baghdad, Iraq",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z"
}

const mockAddresses: Address[] = [
  {
    id: 1,
    name: "Home",
    street: "123 Main Street",
    city: "Baghdad",
    state: "Baghdad",
    country: "Iraq",
    postal_code: "10001",
    phone: "+964 750 123 4567",
    is_default: true,
    type: "home"
  },
  {
    id: 2,
    name: "Office",
    street: "456 Business Ave",
    city: "Baghdad",
    state: "Baghdad",
    country: "Iraq",
    postal_code: "10002",
    phone: "+964 750 987 6543",
    is_default: false,
    type: "work"
  }
]

const mockWallet: Wallet = {
  balance: 0,
  currency: "IQD",
  transactions: []
}

const mockMemberships: Membership[] = [
  {
    id: 1,
    name: "Basic Plan",
    type: "basic",
    price: 0,
    currency: "IQD",
    features: ["Up to 5 shipments per month", "Basic tracking", "Email support"],
    expires_at: "2024-12-31T23:59:59Z",
    is_active: true
  },
  {
    id: 2,
    name: "Premium Plan",
    type: "premium",
    price: 50000,
    currency: "IQD",
    features: ["Unlimited shipments", "Real-time tracking", "Priority support", "Insurance included"],
    expires_at: "2024-12-31T23:59:59Z",
    is_active: false
  }
]

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const USE_MOCK_DATA = false

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<ApiResponse<T>> {
  try {
    const isAdminEndpoint = endpoint.startsWith('/admin')
    const token = isAdminEndpoint 
      ? localStorage.getItem('adminToken') 
      : localStorage.getItem('auth_token')

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    }

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 422 && data.errors) {
        throw {
          success: false,
          message: data.message || 'Validation failed',
          errors: data.errors
        }
      }
      
      throw {
        success: false,
        message: data.message || `API Error: ${response.status}`
      }
    }

    return data
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

export class ApiService {
  static async getUser(): Promise<ApiResponse<User>> {
    return await apiRequest<User>('/user')
  }

  static async updateUser(data: UserProfileForm): Promise<ApiResponse<User>> {
    return await apiRequest<User>('/user', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async changePassword(data: PasswordChangeForm): Promise<ApiResponse<null>> {
    return await apiRequest<null>('/user/password', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async updateUserLocation(data: { location: string }): Promise<ApiResponse<User>> {
    return await apiRequest<User>('/user/location', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async getAddresses(): Promise<ApiResponse<Address[]>> {
    return await apiRequest<Address[]>('/addresses')
  }

  static async createAddress(data: AddressForm): Promise<ApiResponse<Address>> {
    return await apiRequest<Address>('/addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async updateAddress(id: number, data: AddressForm): Promise<ApiResponse<Address>> {
    return await apiRequest<Address>(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async deleteAddress(id: number): Promise<ApiResponse<null>> {
    return await apiRequest<null>(`/addresses/${id}`, {
      method: 'DELETE'
    })
  }

  static async getDeliveryRequests(country?: string): Promise<ApiResponse<DeliveryRequest[]>> {
    const url = country ? `/delivery-requests?country=${encodeURIComponent(country)}` : '/delivery-requests'
    return await apiRequest<DeliveryRequest[]>(url)
  }

  static async getPackages(shippingMethod?: string): Promise<ApiResponse<any[]>> {
    const url = shippingMethod ? `/packages?shipping_method=${encodeURIComponent(shippingMethod)}` : '/packages'
    return await apiRequest<any[]>(url)
  }

  static async getAllPackages(): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>('/packages/all')
  }

  static async getShipments(shippingMethod?: string): Promise<ApiResponse<any[]>> {
    const url = shippingMethod ? `/shipments?shipping_method=${encodeURIComponent(shippingMethod)}` : '/shipments'
    return await apiRequest<any[]>(url)
  }

  static async getArchivedShipments(shippingMethod?: string): Promise<ApiResponse<any[]>> {
    const url = shippingMethod ? `/archive?shipping_method=${encodeURIComponent(shippingMethod)}` : '/archive'
    return await apiRequest<any[]>(url)
  }

  static async getReturnedPackages(shippingMethod?: string): Promise<ApiResponse<any[]>> {
    const url = shippingMethod ? `/archive/returned?shipping_method=${encodeURIComponent(shippingMethod)}` : '/archive/returned'
    return await apiRequest<any[]>(url)
  }

  static async createDeliveryRequest(data: DeliveryRequestForm): Promise<ApiResponse<DeliveryRequest>> {
    return await apiRequest<DeliveryRequest>('/delivery-requests', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async getWallet(): Promise<ApiResponse<Wallet>> {
    return await apiRequest<Wallet>('/wallet')
  }

  static async getMemberships(): Promise<ApiResponse<Membership[]>> {
    return await apiRequest<Membership[]>('/memberships')
  }

  static async updateMembership(membershipId: number): Promise<ApiResponse<Membership>> {
    return await apiRequest<Membership>(`/memberships/${membershipId}`, {
      method: 'PUT'
    })
  }

  static async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      localStorage.removeItem('auth_token')
      return await apiRequest<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        skipAuth: true
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  static async register(userData: {
    name: string
    email: string
    phone: string
    location: string
    password: string
    confirm_password: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      localStorage.removeItem('auth_token')
      return await apiRequest<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        skipAuth: true
      })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  static async logout(): Promise<ApiResponse<null>> {
    const result = await apiRequest<null>('/auth/logout', {
      method: 'POST'
    })
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    return result
  }

  static async searchShipments(query: string): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>(`/search/shipments?q=${encodeURIComponent(query)}`)
  }

  static async searchAddresses(query: string): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>(`/search/addresses?q=${encodeURIComponent(query)}`)
  }

  static async searchTransactions(query: string): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>(`/search/transactions?q=${encodeURIComponent(query)}`)
  }

  static async adminLogin(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    return apiRequest<{ user: any; token: string }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true
    })
  }

  static async verifyAuth(): Promise<ApiResponse<{ authenticated: boolean; user: User }>> {
    return apiRequest<{ authenticated: boolean; user: User }>('/auth/verify', {
      method: 'GET'
    })
  }

  static async verifyAdminAuth(): Promise<ApiResponse<{ authenticated: boolean; user: any }>> {
    return apiRequest<{ authenticated: boolean; user: any }>('/admin/auth/verify', {
      method: 'GET'
    })
  }

  static async adminLogout(): Promise<ApiResponse<null>> {
    const result = await apiRequest<null>('/admin/auth/logout', {
      method: 'POST'
    })
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    return result
  }

  static async getAllClients(search?: string): Promise<ApiResponse<any[]>> {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return apiRequest<any[]>(`/admin/clients${params}`)
  }

  static async getAdminStats(): Promise<ApiResponse<any>> {
    return apiRequest<any>('/admin/stats')
  }

  static async createPackageForClient(clientId: string, packageData: {
    description: string;
    weight: number;
    price: number;
    country: string;
    shipping_method: string;
    status: string;
    estimated_arrival?: string;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest<any>('/admin/packages', {
      method: 'POST',
      body: JSON.stringify({ client_id: clientId, ...packageData })
    })
  }

  static async getClientPackages(clientId: number): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>(`/admin/clients/${clientId}/packages`)
  }

  static async getAllShipments(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/admin/shipments')
  }

  static async getAllArchives(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/admin/archives')
  }

  static async updatePackageStatus(packageId: number, status: string): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/admin/packages/${packageId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  static async updateAdminProfile(data: {
    name: string;
    email: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest<any>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async changeAdminPassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<ApiResponse<null>> {
    return apiRequest<null>('/admin/password', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async getAllDiscounts(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/admin/discounts')
  }

  static async createDiscount(data: any): Promise<ApiResponse<any>> {
    return apiRequest<any>('/admin/discounts', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async updateDiscount(id: number, data: any): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/admin/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async deleteDiscount(id: number): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/admin/discounts/${id}`, {
      method: 'DELETE'
    })
  }

  static async applyDiscount(data: { discount_code: string; package_id: number }): Promise<ApiResponse<any>> {
    return apiRequest<any>('/discounts/apply', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async applyInsurance(packageId: number, data: { insurance_value: number }): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/packages/${packageId}/insurance`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Insurance Packages API (Admin)
  static async getInsuredPackages(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/admin/insured-packages')
  }

  static async getInsuranceStatistics(): Promise<ApiResponse<{ total_insured_packages: number; total_insurance_value: number }>> {
    return apiRequest<{ total_insured_packages: number; total_insurance_value: number }>('/admin/insurance/statistics')
  }

  static async verifyClientAuth(): Promise<ApiResponse<any>> {
    return apiRequest<any>('/auth/verify')
  }

  // Shipping Addresses API (Admin)
  static async getShippingAddresses(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/admin/shipping-addresses')
  }

  static async createShippingAddress(data: {
    title: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest<any>('/admin/shipping-addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  static async updateShippingAddress(id: number, data: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/admin/shipping-addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async deleteShippingAddress(id: number): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/admin/shipping-addresses/${id}`, {
      method: 'DELETE'
    })
  }

  // Shipping Locations API (Customer)
  static async getShippingLocations(): Promise<ApiResponse<any[]>> {
    return apiRequest<any[]>('/shipping-locations')
  }

  static async getShippingLocationById(id: number): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/shipping-locations/${id}`)
  }

  static async requestPackageReturn(packageId: number): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/packages/${packageId}/return-request`, {
      method: 'POST'
    })
  }

  static async requestPackageShipping(packageId: number): Promise<ApiResponse<any>> {
    return apiRequest<any>(`/packages/${packageId}/shipping-request`, {
      method: 'POST'
    })
  }

  static async createBuyForMeRequest(formData: FormData): Promise<ApiResponse<any>> {
    const token = localStorage.getItem('auth_token')
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/buy-for-me-requests`, {
      method: 'POST',
      headers,
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw {
        success: false,
        message: data.message || `API Error: ${response.status}`,
        errors: data.errors
      }
    }

    return data
  }

  static async getBuyForMeRequests(status?: string, page?: number, limit?: number): Promise<ApiResponse<any>> {
    let url = '/buy-for-me-requests'
    const params = new URLSearchParams()
    
    if (status) params.append('status', status)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return await apiRequest<any>(url)
  }

  static async getBuyForMeRequestById(id: number): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/buy-for-me-requests/${id}`)
  }

  static async updateBuyForMeRequestStatus(id: number, data: {
    status: string;
    actual_price?: number;
    tracking_number?: string;
    admin_notes?: string;
  }): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/buy-for-me-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  static async getAdminBuyForMeRequests(): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>('/admin/buy-for-me-requests')
  }

  // Notifications
  static async sendNotification(clientId: number, message: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        message: message
      })
    })
  }

  static async getUserNotifications(): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>('/notifications')
  }

  static async markNotificationAsRead(notificationId: number): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    })
  }

  static async markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/notifications/read-all', {
      method: 'PUT'
    })
  }

  static async deleteNotification(notificationId: number): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/notifications/${notificationId}`, {
      method: 'DELETE'
    })
  }

  // Chat API - User Side
  static async getUserChatMessages(): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>('/chat/messages')
  }

  static async sendUserChatMessage(message: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ 
        message,
        admin_id: 3 // Fixed admin ID
      })
    })
  }

  // Chat API - Admin Side
  static async getAdminChatUsers(): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>('/admin/chat/users')
  }

  static async getAdminChatMessages(userId?: number): Promise<ApiResponse<any[]>> {
    const url = userId ? `/admin/chat/messages?user_id=${userId}` : '/admin/chat/messages'
    return await apiRequest<any[]>(url)
  }

  static async sendAdminChatMessage(message: string, userId: number): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/admin/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ 
        message,
        user_id: userId
      })
    })
  }
}
