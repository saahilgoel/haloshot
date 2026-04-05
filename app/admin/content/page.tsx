"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Pencil,
  Eye,
  ExternalLink,
  FileText,
  Globe,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled";
  author: string;
  views: number;
  publishedAt: string | null;
  updatedAt: string;
}

interface SEOPage {
  id: string;
  title: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  indexed: boolean;
  lastCrawled: string;
}

const mockPosts: BlogPost[] = [
  { id: "1", title: "How AI Headshots Are Changing Professional Photography", slug: "ai-headshots-changing-photography", status: "published", author: "Saahil", views: 4820, publishedAt: "2026-03-15", updatedAt: "2026-03-15" },
  { id: "2", title: "5 Tips for the Perfect AI Headshot Upload", slug: "perfect-ai-headshot-upload-tips", status: "published", author: "Saahil", views: 3210, publishedAt: "2026-03-22", updatedAt: "2026-03-22" },
  { id: "3", title: "HaloShot vs Traditional Photography: Cost Comparison", slug: "haloshot-vs-traditional-photography", status: "published", author: "Saahil", views: 2890, publishedAt: "2026-03-29", updatedAt: "2026-04-01" },
  { id: "4", title: "The Technology Behind AI Face Matching", slug: "technology-behind-ai-face-matching", status: "draft", author: "Saahil", views: 0, publishedAt: null, updatedAt: "2026-04-04" },
  { id: "5", title: "Enterprise Headshots: Scaling Professional Photos for Teams", slug: "enterprise-headshots-teams", status: "scheduled", author: "Saahil", views: 0, publishedAt: "2026-04-10", updatedAt: "2026-04-05" },
  { id: "6", title: "LinkedIn Profile Optimization with AI Headshots", slug: "linkedin-optimization-ai-headshots", status: "draft", author: "Saahil", views: 0, publishedAt: null, updatedAt: "2026-04-03" },
];

const mockSEOPages: SEOPage[] = [
  { id: "1", title: "Homepage", path: "/", metaTitle: "HaloShot - AI Headshots That Actually Look Like You", metaDescription: "Professional AI headshots in 60 seconds. Upload a few selfies, get studio-quality headshots.", indexed: true, lastCrawled: "2026-04-04" },
  { id: "2", title: "Pricing", path: "/pricing", metaTitle: "HaloShot Pricing - Plans Starting at $12/mo", metaDescription: "Simple, transparent pricing. Get professional AI headshots with plans for individuals and teams.", indexed: true, lastCrawled: "2026-04-04" },
  { id: "3", title: "Examples Gallery", path: "/examples", metaTitle: "AI Headshot Examples - See Real Results | HaloShot", metaDescription: "Browse real AI headshot examples. See the quality difference HaloShot delivers.", indexed: true, lastCrawled: "2026-04-03" },
  { id: "4", title: "About", path: "/about", metaTitle: "About HaloShot - Our Story", metaDescription: "Learn about the team behind HaloShot and our mission to democratize professional photography.", indexed: true, lastCrawled: "2026-04-02" },
  { id: "5", title: "Blog", path: "/blog", metaTitle: "HaloShot Blog - AI Photography & Professional Headshots", metaDescription: "Tips, guides, and insights about AI headshots and professional photography.", indexed: true, lastCrawled: "2026-04-04" },
  { id: "6", title: "Terms of Service", path: "/terms", metaTitle: "Terms of Service | HaloShot", metaDescription: "HaloShot terms of service and acceptable use policy.", indexed: false, lastCrawled: "2026-03-15" },
];

const statusBadge: Record<string, string> = {
  draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  published: "bg-lime-400/10 text-lime-400 border-lime-400/20",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Content</h2>
          <p className="text-sm text-muted-foreground">
            Manage blog posts, SEO pages, and site content
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <Tabs defaultValue="blog" className="space-y-4">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger
            value="blog"
            className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400 gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400 gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            SEO Pages
          </TabsTrigger>
        </TabsList>

        {/* Blog Posts Tab */}
        <TabsContent value="blog">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPosts.map((post) => (
                    <TableRow key={post.id} className="border-border">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{post.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            /blog/{post.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs capitalize",
                            statusBadge[post.status]
                          )}
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {post.author}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {post.views > 0 ? post.views.toLocaleString() : "--"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {post.status === "published" && post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short", year: "numeric" }
                            )
                          : post.status === "scheduled" && post.publishedAt
                          ? `Scheduled: ${new Date(
                              post.publishedAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}`
                          : `Edited: ${new Date(
                              post.updatedAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {post.status === "published" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* WYSIWYG placeholder */}
          <Card className="border-border bg-card border-dashed mt-4">
            <CardContent className="py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Click a post to edit in the WYSIWYG editor
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Rich text editor with markdown support, image uploads, and live
                preview
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Pages Tab */}
        <TabsContent value="seo">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Page</TableHead>
                    <TableHead>Meta Title</TableHead>
                    <TableHead>Indexed</TableHead>
                    <TableHead>Last Crawled</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSEOPages.map((page) => (
                    <TableRow key={page.id} className="border-border">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{page.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {page.path}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[240px] truncate">
                        {page.metaTitle}
                      </TableCell>
                      <TableCell>
                        {page.indexed ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-lime-400/10 text-lime-400 border-lime-400/20"
                          >
                            Indexed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          >
                            No Index
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(page.lastCrawled).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
