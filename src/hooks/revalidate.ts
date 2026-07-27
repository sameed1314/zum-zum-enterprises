import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

type EditorialDocument = {
  _status?: "draft" | "published" | null;
  slug?: string | null;
};

export function collectionRevalidationPaths(
  basePaths: string[],
  detailPrefix: string | undefined,
  current: EditorialDocument,
  previous?: EditorialDocument,
): string[] {
  const paths = [...basePaths];
  if (detailPrefix && current.slug) paths.push(`${detailPrefix}/${current.slug}`);
  if (detailPrefix && previous?.slug && previous.slug !== current.slug) {
    paths.push(`${detailPrefix}/${previous.slug}`);
  }
  return [...new Set(paths.filter(Boolean))];
}

function safelyRevalidate(paths: Iterable<string>, logger?: { error: (value: unknown) => void }) {
  for (const path of new Set(paths)) {
    if (!path) continue;
    try {
      revalidatePath(path);
    } catch (error) {
      logger?.error({ error, path, message: "Frontend revalidation failed" });
    }
  }
}

export function createCollectionRevalidation(
  basePaths: string[],
  detailPrefix?: string,
): {
  afterChange: CollectionAfterChangeHook;
  afterDelete: CollectionAfterDeleteHook;
} {
  const afterChange: CollectionAfterChangeHook = ({
    context,
    doc,
    previousDoc,
    req,
  }) => {
    if (context.skipRevalidation) return doc;
    const current = doc as EditorialDocument;
    const previous = previousDoc as EditorialDocument | undefined;
    const isPublished = current._status === "published";
    const wasPublished = previous?._status === "published";

    if (!isPublished && !wasPublished) return doc;

    const paths = collectionRevalidationPaths(
      basePaths,
      detailPrefix,
      current,
      previous,
    );
    safelyRevalidate(paths, req.payload.logger);
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = ({ context, doc, req }) => {
    if (context.skipRevalidation) return doc;
    const deleted = doc as EditorialDocument;
    const paths = collectionRevalidationPaths(
      basePaths,
      detailPrefix,
      deleted,
    );
    safelyRevalidate(paths, req.payload.logger);
    return doc;
  };

  return { afterChange, afterDelete };
}

export function createGlobalRevalidation(paths: string[]): GlobalAfterChangeHook {
  return ({ context, doc, req }) => {
    if (!context.skipRevalidation) safelyRevalidate(paths, req.payload.logger);
    return doc;
  };
}
