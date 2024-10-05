import { RiBookFill, RiHistoryFill, RiUploadCloudLine } from "react-icons/ri";

// with these as constants, teh dashboard items can be reused anywhere within the app and also adding a new Item or removing is also easier without having to go change the navigation code itself.
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
