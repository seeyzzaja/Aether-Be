import { type PermissionValue } from "#shared/permissions/permissions";
export declare function hasPermission(permissions: bigint, permission: PermissionValue): boolean;
export declare function hasAllPermissions(permissions: bigint, required: PermissionValue[]): boolean;
export declare function addPermission(permissions: bigint, permission: PermissionValue): bigint;
export declare function removePermission(permissions: bigint, permission: PermissionValue): bigint;
export declare function canAssignPermissions(actorPermissions: bigint, targetPermissions: bigint): boolean;
//# sourceMappingURL=permission.d.ts.map