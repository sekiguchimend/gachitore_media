import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "gachitore-studio",
  title: "gachitore メディア",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8aikdr31",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  basePath: "/studio",
});

