import { GroupApi } from "@/api/groupsApi";
import GroupCard from "@/components/groupCard";
import { Group } from "@/types/group.type";
import { useEffect, useState } from "react";
import GroupCreateForm from "@/components/groupCreateForm";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await GroupApi.getAllGroups();
        setGroups(data);
      } catch {
        setError("Failed to load groups");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  return (
    <div className="flex-grow flex flex-col items-center bg-white">
      <h1 className="text-3xl font-bold my-4 text-gray-900">Groups</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={openForm}
      >
        + Create New Group
      </button>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <GroupCreateForm onCancel={closeForm} />
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex overflow-x-auto space-x-4 w-full max-w-4xl py-4">
        {groups.map((group) => (
          <GroupCard key={group.id} name={group.title} />
        ))}
      </div>
    </div>
  );
}
