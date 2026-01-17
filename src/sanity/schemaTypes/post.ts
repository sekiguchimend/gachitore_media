import { defineType, defineField, defineArrayMember } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const post = defineType({
  name: "post",
  title: "記事",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "author",
      title: "著者",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "mainImage",
      title: "メイン画像",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "代替テキスト",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "カテゴリー",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "公開日時",
      type: "datetime",
    }),
    defineField({
      name: "excerpt",
      title: "抜粋",
      type: "text",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "body",
      title: "本文",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "通常", value: "normal" },
            { title: "見出し2", value: "h2" },
            { title: "見出し3", value: "h3" },
            { title: "見出し4", value: "h4" },
            { title: "引用", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "太字", value: "strong" },
              { title: "斜体", value: "em" },
              { title: "コード", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "リンク",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "代替テキスト",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "キャプション",
              type: "string",
            }),
          ],
        }),
        defineArrayMember({
          type: "table",
          title: "テーブル",
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "注目記事",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "公開日（新しい順）",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});

