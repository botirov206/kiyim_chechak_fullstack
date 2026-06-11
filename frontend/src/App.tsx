import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { InventoryPage } from "@/pages/InventoryPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { WarehousePage } from "@/pages/WarehousePage";
import { ReportsPage } from "@/pages/ReportsPage";

// for testing
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.login} element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }>
            <Route index element={<DashboardPage />} />
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.customers} element={<CustomersPage />} />
            <Route path={ROUTES.inventory} element={<InventoryPage />} />
            <Route path={ROUTES.orders} element={<OrdersPage />} />
            <Route path={ROUTES.warehouse} element={<WarehousePage />} />
            <Route path={ROUTES.reports} element={<ReportsPage />} />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
