// src/pages/Admin.tsx
import { roleText } from '../types/entities'
import { useTasksCrud } from '../hooks/useTasksCrud'
import { useUsersCrud } from '../hooks/useUsersCrud'
import { useRolesCrud } from '../hooks/useRolesCrud'
import CreateTaskModal from '../components/tasks/CreateTaskModal'
import EditTaskModal from '../components/tasks/EditTaskModal'
import CreateUserModal from '../components/users/CreateUserModal'
import EditUserModal from '../components/users/EditUserModal'
import TaskDetailsModal from '../components/tasks/TaskDetailsModal'
import UserDetailsModal from '../components/users/UserDetailsModal'
import CreateRoleModal from '../components/roles/CreateRoleModal'
import EditRoleModal from '../components/roles/EditRoleModal'
import RoleDetailsModal from '../components/roles/RoleDetailsModal'
import type { TaskRow, UserRow } from '../types/entities'
import { useState } from 'react'

const btnSoft    = 'inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200'
const btnPrimary = 'inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black'
const btnDanger  = 'inline-flex items-center rounded-lg border border-red-200 text-red-700 px-3 py-1.5 shadow-sm transition-colors hover:bg-red-50'

export default function Admin() {
  // Tasks
  const {
    tasks, tasksLoading, simpleUsers,
    createTask, updateTask, deleteTask,
    creatingTask, updatingTask,
  } = useTasksCrud()

  // Users (+ roles for user forms)
  const {
    users, roles, usersLoading,
    createUser, updateUser, deleteUser,
    creatingUser, updatingUser,
  } = useUsersCrud()

  // Roles table CRUD
  const {
    roles: pureRoles, rolesLoading,
    createRole, updateRole, deleteRole,
    creatingRole, updatingRole,
  } = useRolesCrud()

  const [editTask, setEditTask] = useState<TaskRow | null>(null)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [taskDetails, setTaskDetails] = useState<TaskRow | null>(null)
  const [userDetails, setUserDetails] = useState<UserRow | null>(null)

  // Roles modals
  const [createRoleOpen, setCreateRoleOpen] = useState(false)
  const [editRole, setEditRole] = useState<{ id: number | string; name: string } | null>(null)
  const [roleDetails, setRoleDetails] = useState<{ id: number | string; name: string } | null>(null)

  if (tasksLoading || usersLoading || rolesLoading) {
    return <div className="p-4 text-slate-500">Loading…</div>
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
      <div className="grid grid-cols-1 gap-6">
        {/* -------- Tasks Card -------- */}
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 p-3">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <button onClick={() => setCreateTaskOpen(true)} className={btnPrimary}>
              Create Task
            </button>
          </div>
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
                      <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap overflow-x-auto">
                        <button onClick={() => setTaskDetails(t)} className={btnSoft}>Details</button>
                        <button onClick={() => setEditTask(t)} className={btnSoft}>Edit</button>
                        <button onClick={() => deleteTask(t.id)} className={btnDanger}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && <tr><td className="p-4 text-slate-500" colSpan={4}>No tasks.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* -------- Users Card -------- */}
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 p-3">
            <h2 className="text-lg font-semibold">Users</h2>
            <button onClick={() => setCreateUserOpen(true)} className={btnPrimary}>
              Create User
            </button>
          </div>
          <div className="w-full">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3">{u.id}</td>
                    <td className="p-3">{u.username}</td>
                    <td className="p-3">{u.email ?? '—'}</td>
                    <td className="p-3">{roleText(u.role)}</td>
                    <td className="p-3">
                      <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap overflow-x-auto">
                        <button onClick={() => setUserDetails(u)} className={btnSoft}>Details</button>
                        <button onClick={() => setEditUser(u)} className={btnSoft}>Edit</button>
                        <button onClick={() => deleteUser(u.id)} className={btnDanger}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td className="p-4 text-slate-500" colSpan={5}>No users.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* -------- Roles Card -------- */}
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 p-3">
            <h2 className="text-lg font-semibold">Roles</h2>
            <button onClick={() => setCreateRoleOpen(true)} className={btnPrimary}>
              Create Role
            </button>
          </div>
          <div className="w-full">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {pureRoles.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3">
                      <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap overflow-x-auto">
                        <button onClick={() => setRoleDetails(r)} className={btnSoft}>Details</button>
                        <button onClick={() => setEditRole(r)} className={btnSoft}>Edit</button>
                        <button onClick={() => deleteRole(r.id)} className={btnDanger}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pureRoles.length === 0 && <tr><td className="p-4 text-slate-500" colSpan={3}>No roles.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Task Modals */}
      <CreateTaskModal open={createTaskOpen} onClose={() => setCreateTaskOpen(false)} users={simpleUsers} onCreate={(p) => createTask(p)} submitting={creatingTask} />
      <EditTaskModal open={!!editTask} onClose={() => setEditTask(null)} task={editTask} users={simpleUsers} onSave={(p) => updateTask(p)} submitting={updatingTask} />
      <TaskDetailsModal open={!!taskDetails} onClose={() => setTaskDetails(null)} task={taskDetails} />

      {/* User Modals */}
      <CreateUserModal open={createUserOpen} onClose={() => setCreateUserOpen(false)} roles={roles} onCreate={(p) => createUser(p as any)} submitting={creatingUser} />
      <EditUserModal open={!!editUser} onClose={() => setEditUser(null)} user={editUser} roles={roles} onSave={(p) => updateUser(p as any)} submitting={updatingUser} />
      <UserDetailsModal open={!!userDetails} onClose={() => setUserDetails(null)} user={userDetails} />

      {/* Role Modals */}
      <CreateRoleModal open={createRoleOpen} onClose={() => setCreateRoleOpen(false)} onCreate={(p) => createRole({ name: String(p.name || '') })} submitting={creatingRole} />
      <EditRoleModal open={!!editRole} onClose={() => setEditRole(null)} role={editRole as any} onSave={(p) => updateRole({ id: String(p.id!), name: String(p.name || '') })} submitting={updatingRole} />
      <RoleDetailsModal open={!!roleDetails} onClose={() => setRoleDetails(null)} role={roleDetails as any} />
    </div>
  )
}