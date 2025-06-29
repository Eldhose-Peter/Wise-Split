import React, { useEffect, useState } from "react";
import UserSelect from "@/components/userSelect";
import { UsersApi } from "@/api/usersApi";
import { User } from "@/types/user.type";
import { GroupApi } from "@/api/groupsApi";

interface GroupCreateFormProps {
  onCancel: () => void;
}

export default function GroupCreateForm({ onCancel }: GroupCreateFormProps) {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const usersList = await UsersApi.getAllUsers();
        setUsers(usersList.users);
      } catch {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await GroupApi.createGroup({
        title: groupName,
        userIds: selectedUserIds,
      });
      onCancel();
    } catch {
      setError("Failed to create group");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg min-w-[320px] relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onCancel}
      >
        ×
      </button>
      <h2 className="text-xl font-semibold mb-4">Create Group</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          className="border px-3 py-2 rounded"
        />
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <UserSelect
            users={users}
            selectedUserIds={selectedUserIds}
            onChange={setSelectedUserIds}
          />
        )}
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading || submitting}
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
