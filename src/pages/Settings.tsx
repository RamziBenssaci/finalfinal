import { useQuery } from "@tanstack/react-query"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon, User, CreditCard, Shield, Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditProfileModal } from "@/components/modals/EditProfileModal"
import { ChangeLocationModal } from "@/components/modals/ChangeLocationModal"
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal"
import { EditMembershipModal } from "@/components/modals/EditMembershipModal"
import { ApiService } from "@/services/api"

const Settings = () => {
  const { data: userResponse, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: ApiService.getUser
  })

  const { data: addressesResponse, isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: ApiService.getAddresses
  })

  const { data: membershipsResponse, isLoading: membershipsLoading } = useQuery({
    queryKey: ['memberships'],
    queryFn: ApiService.getMemberships
  })

  const { data: walletResponse, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: ApiService.getWallet
  })

  const user = userResponse?.data
  const addresses = addressesResponse?.data || []
  const memberships = membershipsResponse?.data || []
  const wallet = walletResponse?.data

  const loading = userLoading || addressesLoading || membershipsLoading || walletLoading

  const primaryAddress = addresses.find(addr => addr.is_default) || addresses[0]

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading settings...</span>
        </div>
      </Layout>
    )
  }
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account SETTINGS</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="account" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Account Information</span>
              <span className="sm:hidden">Account</span>
            </TabsTrigger>
            <TabsTrigger value="memberships" className="text-xs sm:text-sm">Memberships</TabsTrigger>
            <TabsTrigger value="password" className="text-xs sm:text-sm">Password</TabsTrigger>
            <TabsTrigger value="wallet" className="text-xs sm:text-sm">Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Account Information</span>
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted rounded-lg gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">{user?.name || 'Loading...'}</h3>
                      <p className="text-sm text-muted-foreground">{user?.phone || 'Loading...'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'Loading...'}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <EditProfileModal>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">Edit</Button>
                      </EditProfileModal>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted rounded-lg gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">
                        {user?.location || 'Loading...'}
                      </h3>
                      <p className="text-sm text-muted-foreground">Primary Location</p>
                     
                    </div>
                    <div className="flex-shrink-0">
                      <ChangeLocationModal>
                        <Button className="bg-gradient-primary text-white w-full sm:w-auto">Change Address</Button>
                      </ChangeLocationModal>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="memberships" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Memberships</span>
                </CardTitle>
                <CardDescription>Manage your subscription plans</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {memberships.length > 0 ? (
                    memberships.map((membership) => (
                      <div key={membership.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted rounded-lg gap-4">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${
                            membership.is_active ? 'bg-green-500' : 'bg-gray-500'
                          }`}>
                            <span className="text-white text-xs font-bold">
                              {membership.type.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">{membership.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Expire Date: {new Date(membership.expires_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {membership.price > 0 ? `${membership.price} ${membership.currency}` : 'FREE'} MEMBERSHIP - {membership.type.toUpperCase()}
                            </p>
                            {membership.is_active && (
                              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <EditMembershipModal>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              {membership.is_active ? 'Change Plan' : 'Activate'}
                            </Button>
                          </EditMembershipModal>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No memberships found</p>
                      <p className="text-sm text-muted-foreground mt-2">Subscribe to a plan to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Password & Security</span>
                </CardTitle>
                <CardDescription>Update your password and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Password Settings</h3>
                  <p className="text-muted-foreground mb-4">Manage your account security</p>
                  <ChangePasswordModal>
                    <Button className="bg-gradient-primary text-white">Change Password</Button>
                  </ChangePasswordModal>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallet" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Wallet & Payments</span>
                </CardTitle>
                <CardDescription>Manage your payment methods and wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Balance */}
                <div className="bg-gradient-primary text-white rounded-lg p-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white/80 mb-2">Current Balance</h3>
                    <p className="text-4xl font-bold text-white">
                      {wallet ? `${wallet.balance} ${wallet.currency}` : 'Loading...'}
                    </p>
                  </div>
                </div>
                
                {/* Wallet Transactions */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Your Wallet Transactions</CardTitle>
                    <CardDescription>Recent transaction history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {wallet?.transactions && wallet.transactions.length > 0 ? (
                      <div className="space-y-3">
                        {wallet.transactions.map((transaction, index) => {
                          const isIncoming = transaction.type === 'deposit' || transaction.type === 'refund'
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isIncoming ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                  {isIncoming ? '+' : '-'}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{transaction.description}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(transaction.created_at).toLocaleDateString()}
                                  </p>
                                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {transaction.status}
                                  </span>
                                </div>
                              </div>
                              <div className={`font-semibold ${
                                isIncoming ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {isIncoming ? '+' : '-'}{transaction.amount} {wallet.currency}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No transactions yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Your transaction history will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
