import { Layout } from "@/components/layout/layout"
import { MetricCard } from "@/components/ui/metric-card"
import { Package, TrendingUp, Clock, MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your shipping dashboard</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Package className="w-4 h-4" />
            <span>0 Package</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Active Shipments"
            value="247"
            icon={<Package className="w-6 h-6 text-white" />}
            trend={{ value: "12%", isPositive: true }}
            gradient="primary"
          />
          
          <MetricCard
            title="Total Revenue"
            value="$34,200"
            icon={<DollarSign className="w-6 h-6 text-white" />}
            trend={{ value: "8.2%", isPositive: true }}
            gradient="success"
          />
          
          <MetricCard
            title="Delivery Rate"
            value="96.8%"
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            trend={{ value: "2.1%", isPositive: true }}
            gradient="info"
          />
          
          <MetricCard
            title="Avg Delivery Time"
            value="2.4 days"
            icon={<Clock className="w-6 h-6 text-white" />}
            trend={{ value: "0.3", isPositive: false }}
            gradient="warning"
          />
          
          <MetricCard
            title="Countries Served"
            value="18"
            icon={<MapPin className="w-6 h-6 text-white" />}
            gradient="danger"
          />
          
          <MetricCard
            title="Active Users"
            value="1,247"
            icon={<Users className="w-6 h-6 text-white" />}
            trend={{ value: "5.4%", isPositive: true }}
            gradient="primary"
          />
        </div>

        {/* Additional Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Shipments</CardTitle>
              <CardDescription>Your latest shipping activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">UM1ZZ649</p>
                      <p className="text-sm text-muted-foreground">Belgium → Germany</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">In Transit</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">UM1ZZ648</p>
                      <p className="text-sm text-muted-foreground">USA → Canada</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Delivered</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-warning rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">UM1ZZ647</p>
                      <p className="text-sm text-muted-foreground">Turkey → UAE</p>
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Processing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription>Manage your shipping operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-gradient-primary text-white rounded-lg text-left hover:shadow-glow transition-smooth">
                  <Package className="w-6 h-6 mb-2" />
                  <p className="font-medium">New Shipment</p>
                  <p className="text-xs text-white/80">Create a new shipment</p>
                </button>
                
                <button className="p-4 bg-gradient-success text-white rounded-lg text-left hover:shadow-glow transition-smooth">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <p className="font-medium">Track Package</p>
                  <p className="text-xs text-white/80">Monitor delivery status</p>
                </button>
                
                <button className="p-4 bg-gradient-warning text-white rounded-lg text-left hover:shadow-glow transition-smooth">
                  <MapPin className="w-6 h-6 mb-2" />
                  <p className="font-medium">Manage Address</p>
                  <p className="text-xs text-white/80">Update shipping addresses</p>
                </button>
                
                <button className="p-4 bg-gradient-info text-white rounded-lg text-left hover:shadow-glow transition-smooth">
                  <Clock className="w-6 h-6 mb-2" />
                  <p className="font-medium">Schedule Delivery</p>
                  <p className="text-xs text-white/80">Plan future deliveries</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
