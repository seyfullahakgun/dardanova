export interface NavItem {
  title: string;
  href: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isPublished: boolean;
  authorName: string;
  lang: string;
}
