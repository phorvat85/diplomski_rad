// src/pages/Home.tsx
import { useEffect, useMemo, useState } from 'react'
import { useTasksCrud } from '../hooks/useTasksCrud'
import TaskDetailsModal from '../components/tasks/TaskDetailsModal'
import CreateTaskModal from '../components/tasks/CreateTaskModal'
import EditTaskModal from '../components/tasks/EditTaskModal'
import type { TaskRow } from '../types/entities'

const btnSoft    = 'inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200'
const btnPrimary = 'inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black'
const btnDanger  = 'inline-flex items-center rounded-lg border border-red-200 text-red-700 px-3 py-1.5 shadow-sm transition-colors hover:bg-red-50'

// Safely read current user from localStorage
function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function normalizeRole(r: any): string {
  if (!r) return ''
  if (typeof r === 'string') return r
  if (typeof r === 'object') return r.name ?? ''
  return ''
}

function hasAnyRole(role: any, allowed: string[]) {
  const val = normalizeRole(role).toUpperCase()
  // allow both ADMIN/MANAGER and ROLE_ADMIN/ROLE_MANAGER
  return allowed.some(a => val === a || val === `ROLE_${a}`)
}

// Robust “is this task mine?” check
function isAssignedToUser(task: TaskRow, user: any) {
  if (!user || !task) return false
  const a: any = (task as any).assignee
  if (!a) return false

  const userId = user?.id != null ? String(user.id) : ''
  const assigneeId =
    a?.id != null ? String(a.id) :
    (typeof a === 'string' || typeof a === 'number') ? String(a) : ''

  // If we have solid numeric/string IDs (and userId isn't the placeholder 'me'), compare those
  if (userId && userId !== 'me' && assigneeId) {
    if (userId === assigneeId) return true
  }

  // Fallback: compare usernames (backend might return 'username' or 'name')
  const userName = (user?.username ?? '').toString().trim().toLowerCase()
  const assigneeName = (a?.username ?? a?.name ?? '').toString().trim().toLowerCase()
  if (userName && assigneeName && userName === assigneeName) return true

  // Optional extra fallback: email match if present
  const userEmail = (user?.email ?? '').toString().trim().toLowerCase()
  const assigneeEmail = (a?.email ?? '').toString().trim().toLowerCase()
  if (userEmail && assigneeEmail && userEmail === assigneeEmail) return true

  return false
}

export default function Home() {
  const {
    tasks, tasksLoading, simpleUsers,
    createTask, updateTask, deleteTask,
    creatingTask, updatingTask,
  } = useTasksCrud()

  const [taskDetails, setTaskDetails] = useState<TaskRow | null>(null)
  const [editTask, setEditTask] = useState<TaskRow | null>(null)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)

  const currentUser = useMemo(() => getCurrentUser(), [])
  const canManage = hasAnyRole(currentUser?.role, ['MANAGER', 'ADMIN'])

  // "Only my tasks" toggle with persistence
  const [onlyMine, setOnlyMine] = useState<boolean>(() => localStorage.getItem('home.onlyMine') === '1')
  useEffect(() => {
    localStorage.setItem('home.onlyMine', onlyMine ? '1' : '0')
  }, [onlyMine])

  const visibleTasks = useMemo(() => {
    if (!onlyMine) return tasks
    return tasks.filter(t => isAssignedToUser(t, currentUser))
  }, [tasks, onlyMine, currentUser])

  if (tasksLoading) {
    return <div className="p-4 text-slate-500">Loading…</div>
  }

  return (
    // Same page wrapper as Admin/Manager
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
      {/* Single stacked card */}
      <section className="overflow-hidden rounded-xl border bg-white">
        {/* Header: title + controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 p-3">
          <h2 className="text-lg font-semibold">Tasks</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Only my tasks toggle */}
            <label className="inline-flex select-none items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 accent-slate-700"
                checked={onlyMine}
                onChange={(e) => setOnlyMine(e.target.checked)}
              />
              Only my tasks
            </label>

            {/* Create (managers/admins only) */}
            {canManage && (
              <button onClick={() => setCreateTaskOpen(true)} className={btnPrimary}>
                Create Task
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Est.</th>
                <th className="p-3 text-left">Assignee</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {visibleTasks.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.estimation ?? '—'}</td>
                  <td className="p-3">{(t.assignee as any)?.username ?? (t.assignee as any)?.name ?? '—'}</td>
                  <td className="p-3">
                    {/* Actions: Details for everyone; Edit/Delete for managers/admins */}
                    <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap overflow-x-auto">
                      <button onClick={() => setTaskDetails(t)} className={btnSoft}>Details</button>
                      {canManage && (
                        <>
                          <button onClick={() => setEditTask(t)} className={btnSoft}>Edit</button>
                          <button onClick={() => deleteTask(t.id)} className={btnDanger}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visibleTasks.length === 0 && (
                <tr><td className="p-4 text-slate-500" colSpan={4}>No tasks.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Details Modal */}
      <TaskDetailsModal
        open={!!taskDetails}
        onClose={() => setTaskDetails(null)}
        task={taskDetails}
      />

      {/* Manager/Admin modals */}
      {canManage && (
        <>
          <CreateTaskModal
            open={createTaskOpen}
            onClose={() => setCreateTaskOpen(false)}
            users={simpleUsers}
            onCreate={(p) => createTask(p)}
            submitting={creatingTask}
          />
          <EditTaskModal
            open={!!editTask}
            onClose={() => setEditTask(null)}
            task={editTask}
            users={simpleUsers}
            onSave={(p) => updateTask(p)}
            submitting={updatingTask}
          />
        </>
      )}
    </div>
  )
}