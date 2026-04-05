"use client";

import { UserTable } from "@/components/admin/UserTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Users</h2>
        <p className="text-sm text-muted-foreground">
          Manage users, view activity, and modify plans
        </p>
      </div>
      <UserTable />
    </div>
  );
}
