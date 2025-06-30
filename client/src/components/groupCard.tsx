import React from "react";
import { useRouter } from "next/router";

interface GroupCardProps {
  id: string;
  name: string;
  description?: string;
}

const GroupCard: React.FC<GroupCardProps> = ({ id, name, description }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push({
      pathname: `/groups/${id}`,
      query: { groupName: name },
    });
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 m-2 min-w-[250px] max-w-xs cursor-pointer hover:bg-gray-100 transition"
      onClick={handleClick}
    >
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export default GroupCard;
