import { RiBookFill, RiHistoryFill, RiUploadCloudLine } from "react-icons/ri";

export const DASHBOARD_ITEMS = [
  {
    path: "/recents",
    label: "Recents",
    icon: RiHistoryFill,
  },
  {
    label: "Library",
    icon: RiBookFill,
    items: [
      {
        path: "/lists",
        name: "Lists",
      },
      {
        path: "/personas",
        name: "Personas",
      },
      {
        path: "/agents",
        name: "Agents",
      },
      {
        path: "/projects",
        name: "Projects",
      },
      {
        path: "/prompts",
        name: "Prompts",
      },
    ],
  },
  {
    label: "App Files",
    icon: RiUploadCloudLine,
    path: "/appfiles",
  },
];
