import { render, screen } from "@testing-library/react";
import Shop from "../src/components/Shop";

describe("Shop", () => {
  it("renders Shop component", () => {
    render(<Shop />);

    // Check if "Shop" text is rendered
    const shopText = screen.getByText(/Shop/i);
    expect(shopText).toBeInTheDocument();
  });
});