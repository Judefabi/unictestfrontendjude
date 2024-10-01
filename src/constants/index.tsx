import { RiBookFill, RiHistoryFill, RiUploadCloudLine } from "react-icons/ri";

export const DASHBOARD_ITEMS = [
  {
    id: 1,
    path: "/recents",
    label: "Recents",
    icon: RiHistoryFill,
  },
  {
    id: 2,
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
    id: 3,
    label: "App Files",
    icon: RiUploadCloudLine,
    path: "/appfiles",
  },
];
