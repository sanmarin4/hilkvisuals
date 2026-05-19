import DashboardLayout from '@/components/DashboardLayout'
import BookingTable from '@/components/BookingTable'

export default function BookingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">View Bookings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all customer bookings here.</p>
          </div>
          
          <button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
            Create Manual Booking
          </button>
        </div>

        <BookingTable />
      </div>
    </DashboardLayout>
  )
}
