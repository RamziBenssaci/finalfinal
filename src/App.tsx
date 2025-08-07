import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CountryProvider } from "@/contexts/CountryContext";
import Index from "./pages/Index";
import MySuite from "./pages/MySuite";
import Shipments from "./pages/Shipments";
import Archive from "./pages/Archive";
import Address from "./pages/Address";
import HomeDelivery from "./pages/HomeDelivery";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import AdminClients from "./pages/admin/AdminClients";
import AdminShipments from "./pages/admin/AdminShipments";
import AdminShippingAddresses from "./pages/admin/AdminShippingAddresses";
import AdminDiscounts from "./pages/admin/AdminDiscounts";
import AdminCustomsRequests from "./pages/admin/AdminCustomsRequests";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminInsuredPackages from "./pages/admin/AdminInsuredPackages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CountryProvider>
        <div className="">
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Customer Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><MySuite /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
            <Route path="/archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
            <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
            <Route path="/delivery" element={<ProtectedRoute><HomeDelivery /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminClients />} />
            <Route path="shipments" element={<AdminShipments />} />
            <Route path="shipping-addresses" element={<AdminShippingAddresses />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="insured-packages" element={<AdminInsuredPackages />} />
            <Route path="customs-requests" element={<AdminCustomsRequests />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
      </CountryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
