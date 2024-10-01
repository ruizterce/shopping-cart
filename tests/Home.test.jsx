import { render, screen } from "@testing-library/react";
import Home from "../src/components/Home";

describe("Home", () => {
  it("renders Home component with the landing image", () => {
    render(<Home />);

    // Check if the image with the correct alt text is rendered
    const landingImage = screen.getByAltText(/Landing page image/i);
    expect(landingImage).toBeInTheDocument();
  });
});
