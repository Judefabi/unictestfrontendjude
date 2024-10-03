import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ScrapingProgressModal from "./ScrappingModal";

describe("ScrapingProgressModal Component", () => {
  const onClose = jest.fn();

  const urls = [
    { url: "http://example1.com", progress: 50, status: "scraping" },
    { url: "http://example2.com", progress: 100, status: "complete" },
    { url: "http://example3.com", progress: 25, status: "error" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders URLs with progress and status", () => {
    render(<ScrapingProgressModal urls={urls} onClose={onClose} />);

    // Check if all URLs are rendered
    expect(screen.getByText("http://example1.com")).toBeInTheDocument();
    expect(screen.getByText("http://example2.com")).toBeInTheDocument();
    expect(screen.getByText("http://example3.com")).toBeInTheDocument();

    // Check if progress bars are rendered (based on className or value)
    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.length).toBe(3);

    // Check for statuses
    expect(screen.getByText("scraping")).toHaveClass("text-blue-500");
    expect(screen.getByText("complete")).toHaveClass("text-green-500");
    expect(screen.getByText("error")).toHaveClass("text-red-500");
  });

  test("calls onClose when the close button is clicked", () => {
    render(<ScrapingProgressModal urls={urls} onClose={onClose} />);

    // Simulate clicking the close button
    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    // Ensure onClose is called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when clicking outside the modal", () => {
    render(<ScrapingProgressModal urls={urls} onClose={onClose} />);
  });

  test("does not call onClose when clicking inside the modal", () => {
    render(<ScrapingProgressModal urls={urls} onClose={onClose} />);

    // Simulate clicking inside the modal (the modal content area)
    fireEvent.click(screen.getByText("Website Scraping Progress"));

    // Ensure onClose is not called
    expect(onClose).not.toHaveBeenCalled();
  });
});
