// Sanity 基本型
export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
}

export interface Author {
  _id?: string;
  name: string;
  slug: string;
  bio?: string;
  image?: SanityImage;
  postCount?: number;
}

export interface Category {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface Post {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  featured?: boolean;
  mainImage?: SanityImage;
  author?: Author;
  categories?: Category[];
  body?: PortableTextBlock[];
}

export interface SiteSettings {
  title?: string;
  description?: string;
  logo?: SanityImage;
  ogImage?: SanityImage;
}

// Portable Text 型
export interface PortableTextBlock {
  _key: string;
  _type: string;
  children?: PortableTextChild[];
  style?: string;
  markDefs?: MarkDef[];
  // 画像ブロック用
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
  caption?: string;
}

export interface PortableTextChild {
  _key: string;
  _type: string;
  text?: string;
  marks?: string[];
}

export interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
}

