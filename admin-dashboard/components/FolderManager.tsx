'use client'

import { useState, useEffect } from 'react'
import { 
  Folder, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Search,
  Grid,
  List as ListIcon,
  X,
  Check
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface FolderData {
  id: string
  name: string
  created_at: string
  item_count: number
}

const MOCK_FOLDERS: FolderData[] = [
  { id: '1', name: 'Product Shots', created_at: '2024-05-10', item_count: 24 },
  { id: '2', name: 'Marketing Assets', created_at: '2024-05-12', item_count: 12 },
  { id: '3', name: 'Social Media', created_at: '2024-05-14', item_count: 45 },
  { id: '4', name: 'Client Deliverables', created_at: '2024-05-15', item_count: 8 },
]

export default function FolderManager() {
  const [folders, setFolders] = useState<FolderData[]>(MOCK_FOLDERS)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<FolderData | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    setIsLoading(true)
    
    if (editingFolder) {
      // Update
      setFolders(folders.map(f => f.id === editingFolder.id ? { ...f, name: newFolderName } : f))
      toast.success('Folder updated successfully')
    } else {
      // Create
      const newFolder: FolderData = {
        id: Math.random().toString(36).substr(2, 9),
        name: newFolderName,
        created_at: new Date().toISOString().split('T')[0],
        item_count: 0
      }
      setFolders([newFolder, ...folders])
      toast.success('Folder created successfully')
    }

    setIsLoading(false)
    setIsModalOpen(false)
    setEditingFolder(null)
    setNewFolderName('')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this folder? All contents will be moved to unsorted.')) {
      setFolders(folders.filter(f => f.id !== id))
      toast.success('Folder deleted successfully')
    }
  }

  const openEditModal = (folder: FolderData) => {
    setEditingFolder(folder)
    setNewFolderName(folder.name)
    setIsModalOpen(true)
  }

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500"
              )}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500"
              )}
            >
              <ListIcon size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => {
              setEditingFolder(null)
              setNewFolderName('')
              setIsModalOpen(true)
            }}
            className="h-11 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all ml-auto md:ml-0"
          >
            <Plus size={18} />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFolders.map((folder) => (
            <div 
              key={folder.id}
              className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Folder size={24} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(folder)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(folder.id)} className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">{folder.name}</h4>
              <p className="text-sm text-slate-500 mt-1">{folder.item_count} items</p>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Folder Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFolders.map((folder) => (
                <tr key={folder.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Folder size={20} className="text-indigo-500" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{folder.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{folder.item_count} items</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{folder.created_at}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(folder)} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(folder.id)} className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingFolder ? 'Edit Folder' : 'Create New Folder'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Folder Name</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Summer Collection"
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Saving...' : (editingFolder ? 'Update Folder' : 'Create Folder')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
