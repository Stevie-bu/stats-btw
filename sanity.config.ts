"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "bike-to-work-stats",
  title: "bike to work – Stats",
  projectId: "gecjcr03",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
