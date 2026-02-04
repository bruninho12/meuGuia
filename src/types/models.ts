export type Category = {
  id: string;
  name: string;
  order?: number;
  icon?: string;
};

export type Business = {
  id: string;
  name: string;
  about?: string;
  address?: string;
  categoryId?: string;
  city?: string;
  isFeatured?: boolean;
  phone?: string;
  whatsapp?: string;
  status?: "active" | "pending" | "blocked" | string;
  ownerId?: string;
};
