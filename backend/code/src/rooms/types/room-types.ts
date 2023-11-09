export type roomsData = {
  is_admin: boolean;
  id: string;
  name: string;
  type: string;
  is_owner: boolean;
  countMembers: number;
  last_message: {
    createdAt: Date;
    content: string;
  } | null;
};
