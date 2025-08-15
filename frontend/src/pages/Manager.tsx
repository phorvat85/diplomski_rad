// src/pages/Manager.tsx
import { useState } from 'react'
import type { TaskRow } from '../types/entities'
import { useTasksCrud } from '../hooks/useTasksCrud'
import CreateTaskModal from '../components/tasks/CreateTaskModal'
import EditTaskModal from '../components/tasks/EditTaskModal'
import TaskDetailsModal from '../components/tasks/TaskDetailsModal'

const btnSoft    = 'inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200'
const btnPrimary = 'inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black'
const btnDanger  = 'inline-flex items-center rounded-lg border border-red-200 text-red-700 px-3 py-1.5 shadow-sm transition-colors hover:bg-red-50'

export default function Manager() {
  const {
    tasks, tasksLoading, simpleUsers,
    createTask, updateTask, deleteTask,
    creatingTask, updatingTask,
  } = useTasksCrud()

  const [editTask, setEditTask] = useState<TaskRow | null>(null)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [taskDetails, setTaskDetails] = useState<TaskRow | null>(null)

  if (tasksLoading) {
    return <div className="p-4 text-slate-500">Loading…</div>
  }

  return (
    // Page wrapper for subtle depth
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
      {/* Single stacked card (Tasks) */}
      <section className="overflow-hidden rounded-xl border bg-white">
        {/* Header couples title + create button */}
        <div className="flex items-center justify-between border-b bg-slate-50 p-3">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <button onClick={() => setCreateTaskOpen(true)} className={btnPrimary}>
            Create Task
          </button>
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
              {tasks.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.estimation ?? '—'}</td>
                  <td className="p-3">{t.assignee?.username ?? '—'}</td>
                  <td className="p-3">
                    {/* Keep action buttons on ONE row; allow gentle horizontal scroll if tight */}
                    <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap overflow-x-auto">
                      <button onClick={() => setTaskDetails(t)} className={btnSoft}>Details</button>
                      <button onClick={() => setEditTask(t)} className={btnSoft}>Edit</button>
                      <button onClick={() => deleteTask(t.id)} className={btnDanger}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr><td className="p-4 text-slate-500" colSpan={4}>No tasks.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
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
      <TaskDetailsModal
        open={!!taskDetails}
        onClose={() => setTaskDetails(null)}
        task={taskDetails}
      />
    </div>
  )
}