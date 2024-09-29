import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../src/routes";

describe("ErrorPage Component", () => {
  it("renders the error message and link on an unknown path", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/unknown"],
    });

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole("heading", {
        name: /oh no, nothing found here!/i,
      }),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", {
      name: /you can go back to the home page by clicking here/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
