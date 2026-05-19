import { User, ShoppingBag, Folder, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const activities = [
  {
    id: 1,
    type: 'booking',
    user: 'Sarah Johnson',
    action: 'made a new booking',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    icon: ShoppingBag,
    color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    id: 2,
    type: 'user',
    user: 'Michael Chen',
    action: 'registered as a new user',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: User,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 3,
    type: 'folder',
    user: 'Admin',
    action: 'created a new folder "Marketing Assets"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    icon: Folder,
    color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    id: 4,
    type: 'report',
    user: 'System',
    action: 'generated weekly analytics report',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    icon: FileText,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
  },
]

export default function RecentActivity() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm font-medium text-indigo-600 hover:underline">View all</button>
      </div>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`p-2.5 rounded-xl shrink-0 ${activity.color}`}>
              <activity.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 dark:text-slate-100">
                <span className="font-semibold">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatDistanceToNow(activity.time, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
