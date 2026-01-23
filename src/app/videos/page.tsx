import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VideoGrid from "@/components/VideoGrid";
import PageHeader from "@/components/onwalk/PageHeader";
import { getPublicVideos } from "@/lib/video";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  // ... existing metadata code ...
};

export default async function VideosPage() {
  const videos = await getPublicVideos();

  const videosJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    name: "Onwalk 视频集",
    description: "户外、航拍与行走的影像故事集",
    url: "https://www.onwalk.net/videos",
    publisher: {
      "@type": "Organization",
      name: "Onwalk",
      url: "https://www.onwalk.net",
    },
    mainEntity: videos.slice(0, 10).map((video) => {
      // Ensure uploadDate has timezone info (ISO 8601 format)
      let uploadDate = video.updatedAt || new Date().toISOString();
      if (uploadDate && !uploadDate.includes('T')) {
        uploadDate = new Date(uploadDate).toISOString();
      } else if (uploadDate && !uploadDate.match(/[+-]\d{2}:\d{2}|Z$/)) {
        uploadDate = new Date(uploadDate).toISOString();
      }

      // Provide a default thumbnail if poster is missing
      const rawThumbnail = video.poster || "https://www.onwalk.net/images/video-thumbnail.jpg";
      const thumbnailUrl = rawThumbnail.startsWith('http')
        ? [rawThumbnail]
        : [`https://www.onwalk.net${rawThumbnail}`];

      return {
        "@type": "VideoObject",
        name: video.title || video.slug.split("/").pop(),
        description: video.location
          ? `拍摄地点：${Array.isArray(video.location) ? video.location.join(", ") : video.location}`
          : "Onwalk 视频内容",
        thumbnailUrl,
        uploadDate,
        contentUrl: video.src || "",
        embedUrl: video.src || "",
        url: `https://www.onwalk.net/videos/${video.slug}`,
      };
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8">
        <Breadcrumb
          items={[
            { name: '首页', path: '/' },
            { name: '视频', path: '/videos' }
          ]}
        />
        <PageHeader variant="video" />
        {/* 视频画廊结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videosJsonLd) }}
        />
        <VideoGrid items={videos} columns={3} />
      </main>
      <SiteFooter />
    </div>
  );
}
