import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/Sidebar";
import { DashboardPage } from "@/pages/DashboardPage";
import { ReviewPage } from "@/pages/ReviewPage";
import { HistoryPage } from "@/pages/HistoryPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 10_000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-cream-100 text-warm-800 overflow-hidden relative">
          {/* Animated background orbs */}
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-orb bg-orb-4" />

          <Sidebar />
          <main className="flex-1 overflow-y-auto relative z-10">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.9)",
            color: "#3D2C1E",
            border: "1px solid rgba(220, 200, 170, 0.4)",
            fontSize: "13px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px rgba(140, 100, 60, 0.08)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
