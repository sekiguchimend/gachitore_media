import { defineQuery } from "next-sanity";

// 画像フラグメント
const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  alt
`;

// サイト設定取得
export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo { ${imageFragment} },
    ogImage { ${imageFragment} }
  }
`);

// 全記事取得（一覧用）
export const POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    featured,
    mainImage { ${imageFragment} },
    author->{ name, "slug": slug.current, image { ${imageFragment} } },
    categories[]->{ title, "slug": slug.current }
  }
`);

// 記事一覧（ページネーション対応）
export const POSTS_PAGINATED_QUERY = defineQuery(/* groq */ `
  {
    "posts": *[_type == "post"] | order(publishedAt desc)[$start...$end] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      featured,
      mainImage { ${imageFragment} },
      author->{ name, "slug": slug.current },
      categories[]->{ title, "slug": slug.current }
    },
    "total": count(*[_type == "post"])
  }
`);

// 注目記事取得
export const FEATURED_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage { ${imageFragment} },
    author->{ name, "slug": slug.current, image { ${imageFragment} } },
    categories[]->{ title, "slug": slug.current }
  }
`);

// 最新記事取得
export const LATEST_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post"] | order(publishedAt desc)[0...6] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage { ${imageFragment} },
    author->{ name, "slug": slug.current, image { ${imageFragment} } },
    categories[]->{ title, "slug": slug.current }
  }
`);

// RSS用（軽量）
export const RSS_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...50] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt
  }
`);

// 記事詳細取得（関連記事含む）
export const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body[] {
      ...,
      _type == "image" => {
        ...,
        ${imageFragment}
      }
    },
    mainImage { ${imageFragment} },
    author->{ name, "slug": slug.current, bio, image { ${imageFragment} } },
    categories[]->{ _id, title, "slug": slug.current },
    "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc)[0...4] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      mainImage { ${imageFragment} },
      categories[]->{ title, "slug": slug.current }
    }
  }
`);

// スラッグ一覧取得（静的生成用）
export const POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);

// スラッグ一覧取得（静的生成用：上限付き）
export const POST_SLUGS_LIMITED_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit]{
    "slug": slug.current
  }
`);

// カテゴリースラッグ一覧取得（静的生成用 / sitemap用）
export const CATEGORY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`);

// カテゴリー一覧取得
export const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);

// カテゴリー一覧（ナビ/フィルタ用：軽量）
export const CATEGORIES_NAV_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current
  }
`);

// カテゴリー別記事取得
export const POSTS_BY_CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage { ${imageFragment} },
    author->{ name, "slug": slug.current, image { ${imageFragment} } },
    categories[]->{ title, "slug": slug.current }
  }
`);

// カテゴリー詳細取得
export const CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

// 著者一覧取得
export const AUTHORS_QUERY = defineQuery(/* groq */ `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    bio,
    image { ${imageFragment} },
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);

// 記事検索
export const SEARCH_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && (
    title match $query + "*" ||
    excerpt match $query + "*" ||
    pt::text(body) match $query + "*"
  )] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage { ${imageFragment} },
    author->{ name, "slug": slug.current, image { ${imageFragment} } },
    categories[]->{ title, "slug": slug.current }
  }
`);

// トップページ用：全データを1回で取得
export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  {
    "featured": *[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      mainImage { ${imageFragment} },
      author->{ name, "slug": slug.current },
      categories[]->{ title, "slug": slug.current }
    },
    "latest": *[_type == "post"] | order(publishedAt desc)[0...6] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      mainImage { ${imageFragment} },
      author->{ name, "slug": slug.current },
      categories[]->{ title, "slug": slug.current }
    },
    "categories": *[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "postCount": count(*[_type == "post" && references(^._id)]),
      "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc)[0...6] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        mainImage { ${imageFragment} },
        author->{ name, "slug": slug.current },
        categories[]->{ title, "slug": slug.current }
      }
    }
  }
`);

