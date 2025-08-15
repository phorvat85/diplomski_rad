import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '../api/users'
import { api } from '../api/client'
import type { RoleEntity, UserRow } from '../types/entities'

type CreateUserInput = { username: string; email: string; password: string; role: { id: number } }
type UpdateUserInput = Partial<UserRow> & { role?: { id: number } }
type DeleteUserInput = number | string

export function useUsersCrud() {
  const qc = useQueryClient()

  // Users list
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  })

  // Roles list
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<RoleEntity[]> => (await api.get<RoleEntity[]>('/admin/role/roles')).data,
  })

  // --- Create
  const createUserMut = useMutation({
    mutationFn: (payload: CreateUserInput) => apiCreateUser(payload as any),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['users'] })
      const prev = qc.getQueryData<UserRow[]>(['users'])
      const tempId = `tmp-${Date.now()}`
      const foundRole = roles.find(r => String(r.id) === String(payload.role.id))
      const optimistic: UserRow = {
        id: tempId,
        username: payload.username,
        email: payload.email,
        role: foundRole ?? payload.role,
      }
      qc.setQueryData<UserRow[]>(['users'], (old = []) => [optimistic, ...old])
      return { prev }
    },
    onError: (_e, _p, ctx) => { if (ctx?.prev) qc.setQueryData(['users'], ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['users'] }) },
  })

  // --- Update
  const updateUserMut = useMutation({
    mutationFn: (payload: UpdateUserInput) => apiUpdateUser(payload as any), // must send role by {id}
    onMutate: async (payload: any) => {
      await qc.cancelQueries({ queryKey: ['users'] })
      const prev = qc.getQueryData<UserRow[]>(['users'])
      const displayRole =
        payload?.role?.id != null
          ? (roles.find(r => String(r.id) === String(payload.role.id)) ?? payload.role)
          : payload.role
      qc.setQueryData<UserRow[]>(['users'], (old = []) =>
        old.map(u => (u.id === payload.id ? ({ ...u, ...payload, role: displayRole } as UserRow) : u))
      )
      return { prev }
    },
    onError: (_e, _p, ctx) => { if (ctx?.prev) qc.setQueryData(['users'], ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['users'] }) },
  })

  // --- Delete
  const deleteUserMut = useMutation({
    mutationFn: (id: DeleteUserInput) => apiDeleteUser(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['users'] })
      const prev = qc.getQueryData<UserRow[]>(['users'])
      qc.setQueryData<UserRow[]>(['users'], (old = []) => old.filter(u => u.id !== id))
      return { prev }
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(['users'], ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['users'] }) },
  })

  return {
    users,
    roles,
    usersLoading,
    rolesLoading,

    createUser: (p: CreateUserInput) => createUserMut.mutate(p),
    updateUser: (p: UpdateUserInput) => updateUserMut.mutate(p),
    deleteUser: (id: DeleteUserInput) => deleteUserMut.mutate(id),

    creatingUser: createUserMut.isPending,
    updatingUser: updateUserMut.isPending,
    deletingUser: deleteUserMut.isPending,
  }
}