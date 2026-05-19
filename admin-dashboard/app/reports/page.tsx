import DashboardLayout from '@/components/DashboardLayout'
import ReportsView from '@/components/ReportsView'

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed insights into your business performance.</p>
        </div>

        <ReportsView />
      </div>
    </DashboardLayout>
  )
}
