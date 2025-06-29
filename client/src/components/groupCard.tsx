import React from "react";

interface GroupCardProps {
  name: string;
  description?: string;
}

const GroupCard: React.FC<GroupCardProps> = ({ name, description }) => (
  <div className="bg-white rounded-lg shadow-md p-4 m-2 min-w-[250px] max-w-xs">
    <h2 className="text-xl font-semibold mb-2">{name}</h2>
    {description && <p className="text-gray-600">{description}</p>}
  </div>
);

export default GroupCard;
