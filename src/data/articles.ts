export type Author = {
  username: string;
  name: string;
  bio: string;
  image: string;
  followersCount: number;
};

export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  body: string;
  publishedAt: string;
  author: Author;
  favoritesCount: number;
  tags: string[];
};

export const placeholderAuthorImage = "";

export const authors: Author[] = [
  {
    username: "alice",
    name: "Alice Morgan",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "",
    followersCount: 1284,
  },
  {
    username: "bob",
    name: "Bob Chen",
    bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "",
    followersCount: 642,
  },
];

export const articles: ArticleSummary[] = [
  {
    slug: "build-a-simple-conduit-client",
    title: "Build a simple Conduit client",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publishedAt: "June 29, 2026",
    author: authors[0],
    favoritesCount: 12,
    tags: ["react", "conduit"],
  },
  {
    slug: "react-routing-for-home-pages",
    title: "React routing for home pages",
    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    publishedAt: "June 28, 2026",
    author: authors[1],
    favoritesCount: 5,
    tags: ["routing", "react"],
  },
  {
    slug: "keeping-editors-friendly",
    title: "Keeping article editors friendly",
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
    body: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
    publishedAt: "June 27, 2026",
    author: authors[0],
    favoritesCount: 18,
    tags: ["editor", "ux"],
  },
];

export function findAuthor(username?: string): Author {
  return authors.find((author) => author.username === username) || authors[0];
}

export function findArticle(slug?: string): ArticleSummary {
  return articles.find((article) => article.slug === slug) || articles[0];
}