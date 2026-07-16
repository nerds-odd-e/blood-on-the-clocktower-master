export function RolePicker() {
  return roles.map((role) => (
    <button key={role.id} type="button" onClick={() => onAssign(role.id)}>
      {role.name}
    </button>
  ))
}

declare const roles: Array<{ id: string; name: string }>
declare function onAssign(roleId: string): void
