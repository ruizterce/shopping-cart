import { render, screen } from "@testing-library/react";
import Home from "../src/components/Home";

describe("Home", () => {
  it("renders Home component", () => {
    render(<Home />);

    // Check if "Home" text is rendered
    const homeText = screen.getByText(/Home/i);
    expect(homeText).toBeInTheDocument();
  });
});
