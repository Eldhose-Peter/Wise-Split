import { GroupApi } from "@/api/groupsApi";
import GroupCard from "@/components/groupCard";
import { Group } from "@/types/group.type";
import { useEffect, useState } from "react";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex-grow flex flex-col items-center">
      <h1 className="text-3xl font-bold my-4">Groups</h1>
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
