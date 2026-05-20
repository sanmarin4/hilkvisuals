'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Trash2, 
  User as UserIcon,
  Loader2,
  RefreshCw,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { cn, formatDate } from '@/lib/utils'

interface Profile {
  id: string
  full_name: string
  email: string
  created_at: string
}

export default function UserList() {
  const [users, setUsers] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    setIsMounted(true)
    fetchUsers()

    // Real-time subscription
    const channel = supabase
      .channel('profiles-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new as Profile
            setUsers((prev) => [newUser, ...prev])
            toast.success(`New user registered: ${newUser.full_name || newUser.email}`)
          } else if (payload.eventType === 'DELETE') {
            setUsers((prev) => prev.filter((u) => u.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            const updatedUser = payload.new as Profile
            setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error)
        throw error
      }
      
      if (data) {
        setUsers(data as Profile[])
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch users'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (error) throw error
      toast.success('User deleted successfully')
    } catch (err: any) {
      toast.error('Failed to delete user: ' + err.message)
    }
  }

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase()
    return (
      user.full_name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    )
  })

  // Prevent hydration mismatch
  if (!isMounted) return null

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        
        <button 
          onClick={fetchUsers}
          disabled={isLoading}
          className="h-11 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh List'}</span>
        </button>
      </div>

      {/* User Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Fetching users from Supabase...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] p-6 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connection Error</h3>
            <p className="text-slate-500 max-w-xs mt-2 mb-6">
              {error.includes('fetch') 
                ? 'Could not connect to Supabase. Please check your internet connection and API keys.' 
                : error}
            </p>
            <button 
              onClick={fetchUsers}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] p-6 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
              <UserIcon size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Users Found</h3>
            <p className="text-slate-500 max-w-xs mt-2">
              {searchTerm 
                ? `We couldn't find any users matching "${searchTerm}"`
                : 'Users who register in the mobile app will appear here in real-time.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-indigo-600 font-semibold hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                          {user.full_name ? user.full_name[0].toUpperCase() : <UserIcon size={18} />}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.full_name || 'Anonymous User'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Mail size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
