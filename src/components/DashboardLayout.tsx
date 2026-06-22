import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { Upload } from "./Upload";
import { LayoutDashboard, UploadCloud, Settings, Trash2 } from "lucide-react";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "upload" | "settings">("dashboard");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL sales records from the database? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/sales/clear', { method: 'DELETE' });
      const data = await res.json();
      alert(data.message || 'All records cleared.');
      // Refresh dashboard to show empty state
      setActiveTab('upload');
      setTimeout(() => setActiveTab('dashboard'), 50);
    } catch {
      alert('Failed to delete records. Is the backend server running?');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* Decorative Blur Blobs for light mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/5 blur-[130px] pointer-events-none z-0"></div>

      {/* Left Sidebar */}
      <aside className="w-64 h-full border-r border-slate-200/80 bg-white/80 backdrop-blur-md flex flex-col shrink-0 z-10">
        <div className="p-5 border-b border-slate-100 flex items-center">
          <img src="/logo.png" alt="VE Warranty" className="h-12 w-auto object-contain" />
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shadow-blue-500/5"
                : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-800 border border-transparent"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "upload"
                ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shadow-blue-500/5"
                : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-800 border border-transparent"
            }`}
          >
            <UploadCloud className="w-5 h-5 shrink-0" />
            <span>Upload Data</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "settings"
                ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shadow-blue-500/5"
                : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-800 border border-transparent"
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span>Settings</span>
          </button>

          {/* Delete All Data */}
          <button
            onClick={handleDeleteAll}
            disabled={deleting}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className={`w-5 h-5 shrink-0 ${deleting ? 'animate-pulse' : ''}`} />
            <span>{deleting ? 'Deleting...' : 'Delete All Data'}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Admin Panel</p>
              <p className="text-[10px] text-slate-400">System Connected</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 h-full flex flex-col overflow-hidden z-10">
        <header className="h-16 border-b border-slate-200/80 bg-white/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-extrabold text-slate-650 uppercase tracking-widest">
              {activeTab === "dashboard" ? "Analytics Overview" : activeTab === "upload" ? "Data Import" : "System Settings"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Database
            </span>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 min-h-0 overflow-hidden p-8">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "upload" && <Upload onUploadSuccess={() => setActiveTab("dashboard")} />}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto bg-white/70 border border-slate-200/80 rounded-2xl p-6 backdrop-blur-md shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-slate-800">System Settings</h3>
              <p className="text-slate-500 text-sm mb-6">
                Configure database parameters, user roles, and warranty mapping templates.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">Database Provider</span>
                  <span className="text-sm text-slate-650 font-mono">MongoDB Connected</span>
                </div>
                <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">Warranty Share Config</span>
                  <span className="text-sm text-slate-650">Store: 45% | Vecare: 55%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
