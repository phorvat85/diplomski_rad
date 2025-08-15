import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listRoles, createRole as apiCreateRole, updateRole as apiUpdateRole, deleteRole as apiDeleteRole } from '../api/roles'
import type { RoleEntity } from '../types/entities'

type CreateRoleInput = { name: string }
type UpdateRoleInput = { id: number | string; name: string }
type DeleteRoleInput = number | string

export function useRolesCrud() {
  const qc = useQueryClient()

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: listRoles,
  })

  const createRoleMut = useMutation({
    mutationFn: (payload: CreateRoleInput) => apiCreateRole(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['roles'] })
      const prev = qc.getQueryData<RoleEntity[]>(['roles'])
      const optimistic: RoleEntity = { id: `tmp-${Date.now()}`, name: payload.name }
      qc.setQueryData<RoleEntity[]>(['roles'], (old = []) => [optimistic, ...old])
      return { prev }
    },
    onError: (_e, _p, ctx) => { if (ctx?.prev) qc.setQueryData(['roles'], ctx.prev) },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      qc.invalidateQueries({ queryKey: ['users'] }) // refresh users to reflect renamed roles
    },
  })

  const updateRoleMut = useMutation({
    mutationFn: (payload: UpdateRoleInput) => apiUpdateRole(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['roles'] })
      const prev = qc.getQueryData<RoleEntity[]>(['roles'])
      qc.setQueryData<RoleEntity[]>(['roles'], (old = []) =>
        old.map(r => (String(r.id) === String(payload.id) ? { ...r, name: payload.name } : r))
      )
      return { prev }
    },
    onError: (_e, _p, ctx) => { if (ctx?.prev) qc.setQueryData(['roles'], ctx.prev) },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const deleteRoleMut = useMutation({
    mutationFn: (id: DeleteRoleInput) => apiDeleteRole(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['roles'] })
      const prev = qc.getQueryData<RoleEntity[]>(['roles'])
      qc.setQueryData<RoleEntity[]>(['roles'], (old = []) => old.filter(r => String(r.id) !== String(id)))
      return { prev }
    },
    onError: (_e, _p, ctx) => { if (ctx?.prev) qc.setQueryData(['roles'], ctx.prev) },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    roles,
    rolesLoading,
    createRole: (p: CreateRoleInput) => createRoleMut.mutate(p),
    updateRole: (p: UpdateRoleInput) => updateRoleMut.mutate(p),
    deleteRole: (id: DeleteRoleInput) => deleteRoleMut.mutate(id),
    creatingRole: createRoleMut.isPending,
    updatingRole: updateRoleMut.isPending,
    deletingRole: deleteRoleMut.isPending,
  }
}