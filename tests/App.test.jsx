import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../src/components/NavBar";

describe("NavBar", () => {
  it("renders navigation element", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    const navElement = screen.getByRole("navigation");
    expect(navElement).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute("href")).toBe("/");

    const shopLink = screen.getByText(/Shop/i);
    expect(shopLink).toBeInTheDocument();
    expect(shopLink.getAttribute("href")).toBe("/shop");
  });

  it("displays total number of items in the cart", () => {
    render(
      <MemoryRouter>
        <NavBar totalItems={5} /> {/* Pass totalItems as prop */}
      </MemoryRouter>,
    );

    const totalItemsElement = screen.getByText(/5/); // Total items should display as 5
    expect(totalItemsElement).toBeInTheDocument();
  });
});
