import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const category = defineType({
  name: "category",
  title: "カテゴリー",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "タイトル",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "説明",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});

