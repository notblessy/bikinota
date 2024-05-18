import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colors: {
          bikinota: [
            "#ffe7e7",
            "#ffcfcf",
            "#fe9e9e",
            "#fb6969",
            "#f83c3c",
            "#f72020",
            "#f80d10",
            "#dc0005",
            "#c60003",
            "#ad0000",
          ],
        },
        primaryColor: "bikinota",
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
