import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter to provide routing context
import Home from "../src/components/Home";

describe("Home", () => {
  it("renders Home component with the landing image and link to shop", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    // Check if the image with the correct alt text is rendered
    const landingImage = screen.getByAltText(/Landing page image/i);
    expect(landingImage).toBeInTheDocument();

    // Check if the link to the shop is rendered
    const shopLink = screen.getByText(/Shop/i);
    expect(shopLink).toBeInTheDocument();

    // Check if the link has the correct text
    expect(screen.getByText(/Now!/i)).toBeInTheDocument();

    // Check if the link has the correct URL
    expect(shopLink.closest("a")).toHaveAttribute("href", "/shop");
  });
});
