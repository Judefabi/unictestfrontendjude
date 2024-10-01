import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DASHBOARD_ITEMS } from "@/constants";
import SideNavigation from "./sidebar";

describe("SideNavigation", () => {
  it("renders all labels and items correctly", () => {
    render(<SideNavigation />);

    // Check if the labels and items are rendered
    DASHBOARD_ITEMS.forEach((dashboardItem) => {
      // Check if label is defined
      if (dashboardItem.label) {
        const labelElement = screen.getByText(dashboardItem.label);
        expect(labelElement).toBeInTheDocument();
      }

      // Check if items under each label are rendered
      if (dashboardItem.items) {
        dashboardItem.items.forEach((item) => {
          if (item.name) {
            const itemElement = screen.getByText(item.name);
            expect(itemElement).toBeInTheDocument();
          }
        });
      }
    });
  });

  it("renders links with the correct href", () => {
    render(<SideNavigation />);

    DASHBOARD_ITEMS.forEach((dashboardItem) => {
      if (dashboardItem.items) {
        dashboardItem.items.forEach((item) => {
          if (item.name && item.path) {
            // Use getByRole to ensure we're targeting a link element
            const linkElement = screen.getByRole("link", { name: item.name });
            expect(linkElement).toHaveAttribute("href", item.path);
          }
        });
      }
    });
  });
});
