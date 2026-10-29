import { describe, expect, it } from "vitest";
import {
  assertCampusAccess,
  assertRole,
  assertSameTenant,
  AuthorizationError,
  hasRole,
  tenantScope,
  type TenantActor,
} from "./authorization";

const teacher: TenantActor = {
  userId: "user_1",
  institutionId: "inst_1",
  campusId: "campus_1",
  role: "TEACHER",
};

describe("role checks", () => {
  it("grants an allowed role", () => {
    expect(hasRole(teacher, ["TEACHER", "ADMIN"])).toBe(true);
    expect(() => assertRole(teacher, ["TEACHER"])).not.toThrow();
  });

  it("denies a role outside the allow-list", () => {
    expect(hasRole(teacher, ["INSTITUTION_OWNER"])).toBe(false);
    expect(() => assertRole(teacher, ["INSTITUTION_OWNER"])).toThrow(AuthorizationError);
  });
});

describe("tenant boundary", () => {
  it("accepts the actor's own institution", () => {
    expect(() => assertSameTenant(teacher, "inst_1")).not.toThrow();
  });

  it("rejects cross-tenant access", () => {
    expect(() => assertSameTenant(teacher, "inst_2")).toThrow(/Cross-tenant/);
  });

  it("scopes queries to exactly one institution", () => {
    expect(tenantScope(teacher)).toEqual({ institutionId: "inst_1" });
  });
});

describe("campus scoping", () => {
  it("allows the actor's own campus", () => {
    expect(() => assertCampusAccess(teacher, "campus_1")).not.toThrow();
  });

  it("allows institution-wide records", () => {
    expect(() => assertCampusAccess(teacher, null)).not.toThrow();
  });

  it("rejects a sibling campus", () => {
    expect(() => assertCampusAccess(teacher, "campus_2")).toThrow(/campus/);
  });

  it("lets an institution-wide membership reach any campus", () => {
    const owner: TenantActor = { ...teacher, campusId: null, role: "INSTITUTION_OWNER" };
    expect(() => assertCampusAccess(owner, "campus_9")).not.toThrow();
  });
});
