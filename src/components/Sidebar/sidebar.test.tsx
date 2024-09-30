import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DASHBOARD_ITEMS } from "@/constants";
import SideNavigation from "./sidebar";

// I used GPT-4 to quickly write tests for my components an i made edits where necessary especially in the chcking for dashboard items, GPT-0 for wasn't parsing my items correctly thus tests were failing but with edits based on what is expected the tests ran succesfully

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
          // Check if item name is defined
          if (item.name) {
            const itemElement = screen.getByText(item.name);
            expect(itemElement).toBeInTheDocument();
          }
        });
      } else if (dashboardItem.name) {
        // In case the top-level item doesn't have sub-items but has a name
        const itemElement = screen.getByText(dashboardItem.name);
        expect(itemElement).toBeInTheDocument();
      }
    });
  });

  it("renders links with the correct href", () => {
    render(<SideNavigation />);

    DASHBOARD_ITEMS.forEach((dashboardItem) => {
      if (dashboardItem.items) {
        dashboardItem.items.forEach((item) => {
          if (item.name && item.path) {
            // Check if item name and path are defined
            const linkElement = screen.getByText(item.name).closest("a");
            expect(linkElement).toHaveAttribute("href", item.path);
          }
        });
      } else if (dashboardItem.path && dashboardItem.name) {
        const linkElement = screen.getByText(dashboardItem.name).closest("a");
        expect(linkElement).toHaveAttribute("href", dashboardItem.path);
      }
    });
  });
});
