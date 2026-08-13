import { Permission, type PermissionValue } from "#shared/permissions/permissions";

export function hasPermission(permissions: bigint, permission: PermissionValue): boolean {
  if ((permissions & Permission.ADMINISTRATOR) === Permission.ADMINISTRATOR) {
    return true;
  }

  return (permissions & permission) === permission;
}

export function hasAllPermissions(permissions: bigint, required: PermissionValue[]): boolean {
  return required.every((permission) => hasPermission(permissions, permission));
}

export function addPermission(permissions: bigint, permission: PermissionValue): bigint {
  return permissions | permission;
}

export function removePermission(permissions: bigint, permission: PermissionValue): bigint {
  return permissions & ~permission;
}

export function canAssignPermissions(actorPermissions: bigint, targetPermissions: bigint): boolean {
  if (hasPermission(actorPermissions, Permission.ADMINISTRATOR)) {
    return true;
  }

  return (actorPermissions | targetPermissions) === actorPermissions;
}
