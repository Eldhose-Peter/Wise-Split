import { User } from "@/types/user.type";
import React from "react";

type UserSelectProps = {
  users: User[];
  selectedUserIds: string[];
  onChange: (ids: string[]) => void;
};

export default function UserSelect({
  users,
  selectedUserIds,
  onChange,
}: UserSelectProps) {
  const handleToggle = (id: string) => {
    if (selectedUserIds.includes(id)) {
      onChange(selectedUserIds.filter((uid) => uid !== id));
    } else {
      onChange([...selectedUserIds, id]);
    }
  };

  return (
    <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto">
      {users.map((user) => (
        <label
          key={user.id}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedUserIds.includes(user.id)}
            onChange={() => handleToggle(user.id)}
            className="accent-blue-500"
          />
          <span>
            {user.userName} ({user.email})
          </span>
        </label>
      ))}
    </div>
  );
}
