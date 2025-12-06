export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: string;
  type: 'Blog Post' | 'Guide' | 'Webinar';
  readTime: string;
  coverImage?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogCategory = 
  | 'Coaching Skills'
  | 'Leadership Development'
  | 'ICF Preparation'
  | 'Business Growth'
  | 'Tools & Technology';
