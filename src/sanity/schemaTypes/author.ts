import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export const author = defineType({
  name: "author",
  title: "著者",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "名前",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "プロフィール画像",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "自己紹介",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});

