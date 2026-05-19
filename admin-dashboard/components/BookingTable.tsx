'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Download
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { cn, formatDate, formatCurrency } from '@/lib/utils'

interface Booking {
  id: string
  customer_name: string
  email: string
  date: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  amount: number
}

const MOCK_BOOKINGS: Booking[] = [
  { id: '1', customer_name: 'Alex Rivera', email: 'alex@example.com', date: '2024-05-15', status: 'Confirmed', amount: 150.00 },
  { id: '2', customer_name: 'Emma Watson', email: 'emma@example.com', date: '2024-05-16', status: 'Pending', amount: 200.00 },
  { id: '3', customer_name: 'James Bond', email: '007@example.com', date: '2024-05-17', status: 'Cancelled', amount: 0.00 },
  { id: '4', customer_name: 'Sophia Loren', email: 'sophia@example.com', date: '2024-05-18', status: 'Confirmed', amount: 350.00 },
  { id: '5', customer_name: 'John Doe', email: 'john@example.com', date: '2024-05-19', status: 'Confirmed', amount: 120.00 },
  { id: '6', customer_name: 'Jane Smith', email: 'jane@example.com', date: '2024-05-20', status: 'Pending', amount: 90.00 },
]

export default function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // In a real app, fetch from Supabase
    // fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch bookings')
    } else if (data) {
      setBookings(data as Booking[])
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      // In a real app:
      // const { error } = await supabase.from('bookings').delete().eq('id', id)
      
      setBookings(bookings.filter(b => b.id !== id))
      toast.success('Booking deleted successfully')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all cursor-pointer text-sm font-medium"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <button className="h-11 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{booking.customer_name}</span>
                      <span className="text-xs text-slate-500">{booking.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(booking.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      booking.status === 'Confirmed' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                      booking.status === 'Pending' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
                      booking.status === 'Cancelled' && "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(booking.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900 dark:text-white">1</span> to <span className="font-semibold text-slate-900 dark:text-white">{filteredBookings.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredBookings.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-all" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-all" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
