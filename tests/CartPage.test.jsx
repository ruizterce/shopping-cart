import { render, screen, waitFor } from "@testing-library/react";
import { vi } from 'vitest';
import CartPage from "../src/components/CartPage";
import { useOutletContext } from "react-router-dom";

// Mocking the fetch function
global.fetch = vi.fn();

// Mocking useOutletContext
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useOutletContext: vi.fn(),
}));

describe('CartPage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Simulate a pending promise
    useOutletContext.mockReturnValue({ cart: { 1: 2, 2: 1 } });
    render(<CartPage />);
    expect(screen.getByText(/Loading Products.../i)).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network response from Fakestore API failed')));
    render(<CartPage />);
    await waitFor(() => expect(screen.queryByText(/Loading Products.../i)).not.toBeInTheDocument());
    expect(screen.getByText(/Error: Network response from Fakestore API failed/i)).toBeInTheDocument();
  });

  it('renders no data available message when products are null', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(null) }));
    render(<CartPage />);
    await waitFor(() => expect(screen.queryByText(/Loading Products.../i)).not.toBeInTheDocument());
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it('renders "Your cart is empty" when cart is empty', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })); // Mock empty products
    useOutletContext.mockReturnValue({ cart: {} }); // Empty cart
    render(<CartPage />);
    await waitFor(() => expect(screen.queryByText(/Loading Products.../i)).not.toBeInTheDocument());
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it('renders cart items and calculates total price correctly', async () => {
    const mockProducts = [
      { id: 1, title: 'Laptop', price: 999.99 },
      { id: 2, title: 'Jewelry Set', price: 10 },
      { id: 3, title: 'Phone', price: 699.99 },
      { id: 8, title: 'Watch', price: 50 },
    ];

    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockProducts) }));
    useOutletContext.mockReturnValue({
      cart: { 1: 2, 2: 1, 3: 10, 8: 3 }, // Example cart with products
    });
    render(<CartPage />);
    await waitFor(() => expect(screen.queryByText(/Loading Products.../i)).not.toBeInTheDocument());

    // Select all table rows excluding the header row
    const rows = screen.getAllByRole('row').slice(1); // Skip header row

    // Verify the content of each row
    const [laptopRow, jewelryRow, phoneRow, watchRow] = rows;

    let cells = laptopRow.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('1');
    expect(cells[1]).toHaveTextContent('Laptop');
    expect(cells[2]).toHaveTextContent('999.99 €');
    expect(cells[3]).toHaveTextContent('2');
    expect(cells[4]).toHaveTextContent('1999.98 €');

    cells = jewelryRow.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('2');
    expect(cells[1]).toHaveTextContent('Jewelry Set');
    expect(cells[2]).toHaveTextContent('10 €');
    expect(cells[3]).toHaveTextContent('1');
    expect(cells[4]).toHaveTextContent('10 €');

    cells = phoneRow.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('3');
    expect(cells[1]).toHaveTextContent('Phone');
    expect(cells[2]).toHaveTextContent('699.99 €');
    expect(cells[3]).toHaveTextContent('10');
    expect(cells[4]).toHaveTextContent('6999.9 €');

    cells = watchRow.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('8');
    expect(cells[1]).toHaveTextContent('Watch');
    expect(cells[2]).toHaveTextContent('50 €');
    expect(cells[3]).toHaveTextContent('3');
    expect(cells[4]).toHaveTextContent('150 €');

    const totalCell = screen.getByText(/9159.88 €/i); // Total for all items
    expect(totalCell).toBeInTheDocument();
  });
});
