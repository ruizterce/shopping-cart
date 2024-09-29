import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Shop from "../src/components/Shop";
import { useOutletContext } from "react-router-dom";

// Mocking the fetch function
global.fetch = vi.fn();

// Mocking useOutletContext
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useOutletContext: vi.fn(),
}));

describe("Shop", () => {
  beforeEach(() => {
    fetch.mockClear();
    useOutletContext.mockReturnValue({
      cart: { 1: 2, 2: 1, 3: 0, 8: 3 },
      addToCart: vi.fn(),
    });
  });

  it("renders loading state initially", () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Simulate a pending promise
    render(<Shop />);
    expect(screen.getByText(/Loading Products.../i)).toBeInTheDocument();
  });

  it("renders error message when fetch fails", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network response from Fakestore API failed")),
    );
    render(<Shop />);
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading Products.../i),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByText(/Error: Network response from Fakestore API failed/i),
    ).toBeInTheDocument();
  });

  it("renders no data available message when products are null", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(null) }),
    );
    render(<Shop />);
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading Products.../i),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it("renders products when fetch is successful", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Laptop",
        price: 999.99,
        image: "http://example.com/laptop.jpg",
        category: "electronics",
      },
      {
        id: 2,
        title: "Jewelry Set",
        price: 10,
        image: "http://example.com/jewelry.jpg",
        category: "jewelery",
      },
      {
        id: 3,
        title: "Phone",
        price: 699.99,
        image: "http://example.com/phone.jpg",
        category: "electronics",
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockProducts) }),
    );
    render(<Shop />);
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading Products.../i),
      ).not.toBeInTheDocument(),
    );

    expect(screen.getByText(/Laptop/i)).toBeInTheDocument();
    expect(screen.getByText(/Jewelry Set/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByText(/999.99€/i)).toBeInTheDocument();
    expect(screen.getByText(/10€/i)).toBeInTheDocument();
    expect(screen.getByText(/699.99€/i)).toBeInTheDocument();
  });

  it("displays the correct quantity in cart for each product", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Laptop",
        price: 999.99,
        image: "http://example.com/laptop.jpg",
        category: "electronics",
      },
      {
        id: 2,
        title: "Jewelry Set",
        price: 10,
        image: "http://example.com/jewelry.jpg",
        category: "jewelery",
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockProducts) }),
    );
    render(<Shop />);
    await waitFor(() =>
      expect(screen.queryByText(/Laptop/i)).toBeInTheDocument(),
    );

    expect(screen.getByText(/Quantity in Cart: 2/i)).toBeInTheDocument(); // For Laptop (id 1)
    expect(screen.getByText(/Quantity in Cart: 1/i)).toBeInTheDocument(); // For Jewelry Set (id 2)
  });

  it("updates quantity in input field and adds product to cart on clicking Add to Cart", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Laptop",
        price: 999.99,
        image: "http://example.com/laptop.jpg",
        category: "electronics",
      },
    ];

    const mockAddToCart = vi.fn();
    useOutletContext.mockReturnValue({
      cart: { 1: 2 },
      addToCart: mockAddToCart,
    });

    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockProducts) }),
    );
    render(<Shop />);
    await waitFor(() =>
      expect(screen.getByText(/Laptop/i)).toBeInTheDocument(),
    );

    const quantityInput = screen.getByDisplayValue(1);
    fireEvent.change(quantityInput, { target: { value: "3" } });
    const addToCartButton = screen.getByText(/Add to Cart/i);

    expect(addToCartButton).toBeEnabled(); // Ensure the button is enabled

    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });

    expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0], 3); // Check arguments
    expect(quantityInput.value).toBe("1"); // Check if input resets
  });
});
