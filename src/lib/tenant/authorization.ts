export const membershipRoles = [
  "INSTITUTION_OWNER",
  "ADMIN",
  "PRINCIPAL",
  "TEACHER",
  "STUDENT",
  "GUARDIAN",
  "ACCOUNTANT",
  "STAFF",
] as const;

export type MembershipRole = (typeof membershipRoles)[number];

export type TenantActor = Readonly<{
  userId: string;
  institutionId: string;
  campusId: string | null;
  role: MembershipRole;
}>;

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function hasRole(actor: TenantActor, allowedRoles: readonly MembershipRole[]): boolean {
  return allowedRoles.includes(actor.role);
}

export function assertRole(actor: TenantActor, allowedRoles: readonly MembershipRole[]): void {
  if (!hasRole(actor, allowedRoles)) {
    throw new AuthorizationError("The current membership cannot perform this action.");
  }
}

export function assertSameTenant(actor: TenantActor, institutionId: string): void {
  if (actor.institutionId !== institutionId) {
    throw new AuthorizationError("Cross-tenant access is not allowed.");
  }
}

export function assertCampusAccess(actor: TenantActor, campusId: string | null): void {
  if (campusId !== null && actor.campusId !== null && actor.campusId !== campusId) {
    throw new AuthorizationError("The current membership cannot access this campus.");
  }
}

export function tenantScope(actor: TenantActor): Readonly<{ institutionId: string }> {
  return { institutionId: actor.institutionId };
}
