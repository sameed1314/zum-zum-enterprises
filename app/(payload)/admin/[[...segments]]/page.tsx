import type { Metadata } from "next";
import config from "@payload-config";
import {
  generatePageMetadata,
  RootPage,
} from "@payloadcms/next/views";
import { importMap } from "../importMap";

type Props = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  return generatePageMetadata({ config, params, searchParams });
}

export default function AdminPage(props: Props) {
  return RootPage({ config, importMap, ...props });
}
