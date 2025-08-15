import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '../api/tasks'
import { listUsers } from '../api/users'
import type { TaskRow, UserRow } from '../types/entities'

type CreateTaskInput = Partial<TaskRow> // accepts { title, description?, estimation?, assignee?: {id} }
type UpdateTaskInput = Partial<TaskRow> // accepts { id, ...fields, assignee?: {id}|null }
type DeleteTaskInput = number | string

export function useTasksCrud() {
  const qc = useQueryClient()

  // Tasks list
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: listTasks,
  })

  // Minimal users (id, username) for assignee dropdown + optimistic username mapping
  const { data: simpleUsers = [], isLoading: simpleUsersLoading } = useQuery({
    queryKey: ['users-lite'],
    queryFn: async () => {
      const full: UserRow[] = await listUsers()
      return full.map(u => ({ id: u.id, username: u.username }))
    },
  })

  // --- Create
  const createTaskMut = useMutation({
    mutationFn: async (payload: CreateTaskInput) => {
      const body: any = {
        title: payload.title,
        description: payload.description,
        estimation: payload.estimation,
      }
      if (payload.assignee?.id != null) {
        body.assignee = { id: payload.assignee.id } // backend ManyToOne
      }
      return apiCreateTask(body)
    },
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })
      const prev = qc.getQueryData<TaskRow[]>(['tasks'])

      // optimistic row
      const tmpId = `tmp-${Date.now()}`
      const assigneeId = payload.assignee?.id
      const found = assigneeId != null
        ? simpleUsers.find(u => String(u.id) === String(assigneeId))
        : undefined

      const optimistic: TaskRow = {
        id: tmpId,
        title: String(payload.title ?? ''),
        description: String(payload.description ?? ''),
        estimation: String(payload.estimation ?? ''),
        assignee: assigneeId != null ? { id: assigneeId, username: found?.username ?? '' } : null,
      }

      qc.setQueryData<TaskRow[]>(['tasks'], (old = []) => [optimistic, ...old])
      return { prev }
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(['tasks'], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // --- Update
  const updateTaskMut = useMutation({
    mutationFn: async (payload: UpdateTaskInput) => {
      const body: any = {
        id: payload.id,
        title: payload.title,
        description: payload.description,
        estimation: payload.estimation,
      }
      if ('assignee' in (payload as any)) {
        const a = (payload as any).assignee
        body.assignee = a ? { id: a.id } : null // null clears assignment
      }
      return apiUpdateTask(body)
    },
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })
      const prev = qc.getQueryData<TaskRow[]>(['tasks'])

      qc.setQueryData<TaskRow[]>(['tasks'], (old = []) =>
        old.map(t => {
          if (t.id !== payload.id) return t
          let nextAssignee = t.assignee
          if ('assignee' in (payload as any)) {
            const a = (payload as any).assignee
            if (a && a.id != null) {
              const found = simpleUsers.find(u => String(u.id) === String(a.id))
              nextAssignee = { id: a.id, username: found?.username ?? t.assignee?.username ?? '' }
            } else if (a === null) {
              nextAssignee = null
            }
          }
          return { ...t, ...payload, assignee: nextAssignee } as TaskRow
        })
      )
      return { prev }
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(['tasks'], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // --- Delete
  const deleteTaskMut = useMutation({
    mutationFn: (id: DeleteTaskInput) => apiDeleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })
      const prev = qc.getQueryData<TaskRow[]>(['tasks'])
      qc.setQueryData<TaskRow[]>(['tasks'], (old = []) => old.filter(t => t.id !== id))
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['tasks'], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Facade
  return {
    tasks,
    tasksLoading,
    simpleUsers,             // [{id, username}] for dropdowns
    simpleUsersLoading,

    createTask: (p: CreateTaskInput) => createTaskMut.mutate(p),
    updateTask: (p: UpdateTaskInput) => updateTaskMut.mutate(p),
    deleteTask: (id: DeleteTaskInput) => deleteTaskMut.mutate(id),

    creatingTask: createTaskMut.isPending,
    updatingTask: updateTaskMut.isPending,
    deletingTask: deleteTaskMut.isPending,
  }
}