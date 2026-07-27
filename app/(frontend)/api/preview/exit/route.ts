import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request): Promise<Response> {
  const candidate = new URL(request.url).searchParams.get("path") || "/";
  const path =
    candidate.startsWith("/") && !candidate.startsWith("//") ? candidate : "/";
  const draft = await draftMode();
  draft.disable();
  redirect(path);
}
