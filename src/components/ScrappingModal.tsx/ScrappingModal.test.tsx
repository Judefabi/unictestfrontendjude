import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { X } from "lucide-react";
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

  test("renders URLs with progress, status, and icons", () => {
    render(<ScrapingProgressModal urls={urls} onClose={onClose} />);

    // Check if all URLs are rendered
    expect(screen.getByText("http://example1.com")).toBeInTheDocument();
    expect(screen.getByText("http://example2.com")).toBeInTheDocument();
    expect(screen.getByText("http://example3.com")).toBeInTheDocument();

    // Check if progress bars are rendered (based on value)
    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.length).toBe(3);

    // Check if statuses are rendered
    expect(screen.getByText("scraping")).toHaveClass("text-[#9B9B9B]");
    expect(screen.getByText("complete")).toHaveClass("text-[#40AE54]");
    expect(screen.getByText("error")).toHaveClass("text-red-500");
  });

  test("calls onClose when the Cancel All button is clicked", () => {
    render(<ScrapingProgressModal urls={urls} onClose={onClose} />);

    // Simulate clicking the Cancel All button
    const cancelButton = screen.getByText("Cancel All");
    fireEvent.click(cancelButton);

    // Ensure onClose is called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("displays the correct number of URLs being searched", () => {
    render(<ScrapingProgressModal urls={urls} onClose={onClose} />);

    // Check for the correct text showing how many URLs are being searched
    expect(
      screen.getByText(`Searching ${urls.length} of x websites`)
    ).toBeInTheDocument();
  });
});
