'use client'

import { useState } from 'react'
import { 
  FileText, 
  Download, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  BarChart as BarIcon
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { utils, writeFile } from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

const dailyData = [
  { name: 'Mon', revenue: 4500, bookings: 12 },
  { name: 'Tue', revenue: 3200, bookings: 8 },
  { name: 'Wed', revenue: 5800, bookings: 15 },
  { name: 'Thu', revenue: 4100, bookings: 11 },
  { name: 'Fri', revenue: 6500, bookings: 20 },
  { name: 'Sat', revenue: 7200, bookings: 25 },
  { name: 'Sun', revenue: 5900, bookings: 18 },
]

const pieData = [
  { name: 'Confirmed', value: 65 },
  { name: 'Pending', value: 25 },
  { name: 'Cancelled', value: 10 },
]

const COLORS = ['#6366f1', '#fbbf24', '#f87171']

export default function ReportsView() {
  const [timeRange, setTimeRange] = useState('Weekly')

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(dailyData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Report")
    writeFile(wb, "HilkAdmin_Report.xlsx")
    toast.success('Excel report exported!')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text("HilkAdmin - Business Report", 20, 10)
    
    const tableData = dailyData.map(item => [item.name, `$${item.revenue}`, item.bookings])
    
    ;(doc as any).autoTable({
      head: [['Day', 'Revenue', 'Bookings']],
      body: tableData,
      startY: 20,
    })
    
    doc.save("HilkAdmin_Report.pdf")
    toast.success('PDF report exported!')
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <Calendar size={18} className="text-slate-400" />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcel}
            className="h-11 px-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Download size={18} />
            <span>Excel</span>
          </button>
          <button 
            onClick={exportToPDF}
            className="h-11 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <FileText size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue vs Bookings</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs text-slate-500">Bookings</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Booking Status</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 space-y-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: '$45,200', change: '+12.5%', isUp: true },
          { label: 'Average Booking', value: '$240', change: '-2.4%', isUp: false },
          { label: 'Conversion Rate', value: '18.4%', change: '+4.2%', isUp: true },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <div className="flex items-center justify-between mt-2">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</h4>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                item.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {item.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
