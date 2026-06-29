import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArticleList from "../components/ArticleList";

// Mock AuthContext
jest.mock("context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
  }),
}));

// eslint-disable-next-line react/display-name
jest.mock("components/FollowButton", () => () => <button>Follow</button>);
// eslint-disable-next-line react/display-name
jest.mock("components/FavoriteButton", () => () => <button>Favorite</button>);

describe("ArticleList", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            articles: [
              {
                slug: "test-article",
                title: "Test Article",
                description: "This is a test article",
                body: "Body",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
                favoritesCount: 3,
                favorited: false,
                tagList: [],
                author: {
                  username: "john",
                  bio: "",
                  image: "",
                  following: false,
                },
              },
            ],
          }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders fetched articles", async () => {
    render(
      <MemoryRouter>
        <ArticleList />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading articles/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test article")
      ).toBeInTheDocument();
      expect(screen.getByText("john")).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/articles",
      expect.objectContaining({
        headers: {},
      })
    );
  });
});