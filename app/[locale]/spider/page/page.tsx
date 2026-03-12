import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SpiderPageViewer } from "@/components/spider-page-viewer";

export const metadata: Metadata = {
  title: "Spider — Cached Page",
};

export default function SpiderCachedPage() {
  return (
    <main>
      <Nav />
      <SpiderPageViewer />
    </main>
  );
}
