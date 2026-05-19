import DashboardLayout from '@/components/DashboardLayout'
import UserList from '@/components/UserList'

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Registered Users</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage users who registered via the mobile application.</p>
        </div>

        <UserList />
      </div>
    </DashboardLayout>
  )
}
