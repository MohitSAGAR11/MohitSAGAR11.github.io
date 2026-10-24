import type { MetadataRoute } from "next";
import { githubSyncedAt, profile } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${profile.siteUrl}/`, lastModified: githubSyncedAt, changeFrequency: "weekly", priority: 1 }];
}
