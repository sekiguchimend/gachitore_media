import { createImageUrlBuilder } from "@sanity/image-url";
import { projectId, dataset } from "./client";

const builder = createImageUrlBuilder({ projectId, dataset });

// @sanity/image-url の型定義はバージョン差分が出やすいので、ここでは柔軟に扱う
export const urlFor = (source: any) => {
  return builder.image(source);
};

