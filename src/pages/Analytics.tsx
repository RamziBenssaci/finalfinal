import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Package, Users } from "lucide-react"

const Analytics = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your shipping performance and insights</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Monthly Shipments</p>
                  <p className="text-2xl font-bold">154</p>
                  <p className="text-white/60 text-xs">+12% from last month</p>
                </div>
                <Package className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-success text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">98.2%</p>
                  <p className="text-white/60 text-xs">+2.1% improvement</p>
                </div>
                <TrendingUp className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-warning text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Avg Delivery</p>
                  <p className="text-2xl font-bold">3.2 days</p>
                  <p className="text-white/60 text-xs">-0.5 days faster</p>
                </div>
                <BarChart3 className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-info text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Customer Satisfaction</p>
                  <p className="text-2xl font-bold">4.8/5</p>
                  <p className="text-white/60 text-xs">Excellent rating</p>
                </div>
                <Users className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Shipping Volume Trends</CardTitle>
              <CardDescription>Monthly shipping volume over time</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chart visualization would be here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Delivery Performance</CardTitle>
              <CardDescription>Success rates and delivery times</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Performance metrics chart</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;