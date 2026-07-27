import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { canManageContentUser } from "@/src/access";

const allowedPreviewPath = (path: string): boolean =>
  path.startsWith("/") &&
  !path.startsWith("//") &&
  ["/", "/about", "/contact", "/projects/", "/services"].some(
    (prefix) => path === prefix || path.startsWith(prefix),
  );

export async function GET(request: Request): Promise<Response> {
  const path = new URL(request.url).searchParams.get("path");
  if (!path || !allowedPreviewPath(path)) {
    return new Response("Invalid preview path.", { status: 400 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!canManageContentUser(user)) {
    return new Response("You are not allowed to preview this content.", {
      status: 403,
    });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(path);
}
