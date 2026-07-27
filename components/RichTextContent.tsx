import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Project } from "@/src/payload-types";

export function RichTextContent({
  data,
  className,
}: {
  data?: Project["overview"] | null;
  className?: string;
}) {
  if (!data?.root?.children?.length) return null;
  return <RichText className={className} data={data} />;
}
