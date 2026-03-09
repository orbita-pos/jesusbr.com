import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SpiderSearch } from "@/components/spider-search";

export const metadata: Metadata = {
  title: "Spider — Motor de busqueda construido desde cero | Jesus Bernal",
  description:
    "Motor de busqueda construido desde cero en Go. Crawler, inverted index, BM25, PageRank — sin Elasticsearch, sin APIs externas. Todo desde cero.",
  openGraph: {
    title: "Spider — Motor de busqueda desde cero",
    description:
      "Busca en 50,000+ paginas indexadas por un crawler propio con ranking BM25 + PageRank. Construido en Go, sin dependencias externas.",
    type: "website",
    url: "https://jesusbr.com/spider",
  },
};

export default function SpiderPage() {
  return (
    <main>
      <Nav />
      <SpiderSearch />
    </main>
  );
}
