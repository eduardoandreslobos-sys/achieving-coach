export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: BlogCategory;
  type: 'Blog Post' | 'Guide' | 'Webinar';
  readTime: string;
  published: boolean;
  scheduledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogCategory = 
  | 'Coaching Skills'
  | 'Leadership Development'
  | 'ICF Preparation'
  | 'Business Growth'
  | 'Tools & Technology';
