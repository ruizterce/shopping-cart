import { render, screen, waitFor } from "@testing-library/react";
import { vi } from 'vitest';
import Shop from "../src/components/Shop";

// Mocking the fetch function
global.fetch = vi.fn();

describe('Shop', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => { })); // Simulate a pending promise
    render(<Shop />);

    expect(screen.getByText(/Loading Products.../i)).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network response from Fakestore API failed')));

    render(<Shop />);

    // Wait for the loading to complete
    await waitFor(() => expect(screen.queryByText(/Loading Products.../i)).not.toBeInTheDocument());

    expect(screen.getByText(/Error: Network response from Fakestore API failed/i)).toBeInTheDocument();
  });

  it('renders no data available message when products are null', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(null) }));

    render(<Shop />);

    // Wait for the loading to complete
    await waitFor(() => expect(screen.queryByText(/Loading Products.../i)).not.toBeInTheDocument());

    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it('renders products when fetch is successful', async () => {
    const mockProducts = [
      { id: 1, title: 'Laptop', price: 999.99, image: 'http://example.com/laptop.jpg', category: 'electronics' },
      { id: 2, title: 'Jewelry Set', price: 10, image: 'http://example.com/jewelry.jpg', category: 'jewelery' },
      { id: 3, title: 'Phone', price: 699.99, image: 'http://example.com/phone.jpg', category: 'electronics' },
    ];

    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockProducts) }));

    render(<Shop />);

    // Wait for the loading to complete
    await waitFor(() => expect(screen.queryByText(/Loading Products.../i)).not.toBeInTheDocument());

    expect(screen.getByText(/Laptop/i)).toBeInTheDocument();
    expect(screen.getByText(/Jewelry Set/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByText(/999.99€/i)).toBeInTheDocument();
    expect(screen.getByText(/10€/i)).toBeInTheDocument();
    expect(screen.getByText(/699.99€/i)).toBeInTheDocument();
  });
});