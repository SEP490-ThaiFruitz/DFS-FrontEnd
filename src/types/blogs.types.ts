export type BlogPost = {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  tagNames: string[];
  user: {
    email: string;
    avatar: string;
    name: string;
  };
  blogCategory: {
    id: number;
    name: string;
  };
  createdOnUtc: string; // ISO date string
  modifiedOnUtc: string; // ISO date string
  isPublished: boolean;
};
