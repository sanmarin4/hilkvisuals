import DashboardLayout from '@/components/DashboardLayout'
import FolderManager from '@/components/FolderManager'

export default function FoldersPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add Folders</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your content into categories and folders.</p>
        </div>

        <FolderManager />
      </div>
    </DashboardLayout>
  )
}
