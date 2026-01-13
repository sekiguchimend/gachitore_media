import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "サイト設定",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "サイトタイトル",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "サイト説明",
      type: "text",
    }),
    defineField({
      name: "logo",
      title: "ロゴ",
      type: "image",
    }),
    defineField({
      name: "ogImage",
      title: "OGP画像",
      type: "image",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
    },
  },
});

