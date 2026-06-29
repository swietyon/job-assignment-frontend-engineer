import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/Header", () => function MockHeader() { return <div>Header</div>; });
jest.mock("./components/ArticleList", () => function MockArticleList() { return <div>ArticleList</div>; });
jest.mock("./pages/LoginRegister", () => function MockLoginPage() { return <div>LoginPage</div>; });
jest.mock("./pages/Logout", () => function MockLogoutPage() { return <div>LogoutPage</div>; });
jest.mock("./pages/Profile", () => function MockProfilePage() { return <div>ProfilePage</div>; });
jest.mock("./components/Article", () => function MockArticlePage() { return <div>ArticlePage</div>; });
jest.mock("./components/Editor", () => function MockEditorPage() { return <div>EditorPage</div>; });

describe("App", () => {
  it("renders home page by default", () => {

    window.location.hash = "#/";

    render(<App />);

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("ArticleList")).toBeInTheDocument();
  });
});