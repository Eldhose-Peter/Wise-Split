type Group = {
  id: string;
  title: string;
  members?: { id: string; userName: string; email: string }[];
};

export type { Group };
