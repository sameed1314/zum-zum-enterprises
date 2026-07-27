import type { Project } from "@/src/payload-types";

export function textToLexical(text: string): Project["overview"] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => ({
      type: "paragraph",
      version: 1,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      textFormat: 0,
      textStyle: "",
      children: [
        {
          type: "text",
          version: 1,
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
          text: value,
        },
      ],
    }));

  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: paragraphs,
    },
  };
}
