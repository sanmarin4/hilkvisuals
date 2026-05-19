import DashboardLayout from '@/components/DashboardLayout'
import DashboardCards from '@/components/DashboardCards'
import DashboardCharts from '@/components/DashboardCharts'
import RecentActivity from '@/components/RecentActivity'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>

        <DashboardCards />
        
        <DashboardCharts />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div className="lg:col-span-1">
            {/* Additional info or quick actions */}
            <div className="bg-indigo-600 rounded-3xl p-6 mt-8 text-white shadow-lg shadow-indigo-500/20">
              <h4 className="text-xl font-bold mb-2">Upgrade to Pro</h4>
              <p className="text-indigo-100 text-sm mb-6">Get access to advanced analytics and unlimited reports.</p>
              <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
                Learn More
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mt-6">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Tips</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="text-indigo-500">•</span>
                  Check your monthly revenue reports regularly.
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-500">•</span>
                  Keep your folder structure organized.
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-500">•</span>
                  Manage active bookings efficiently.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
