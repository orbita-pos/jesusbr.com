import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "es"];
  const baseUrl = "https://jesusbr.com";

  const pages = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/orbita", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/cfdi", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );
}
