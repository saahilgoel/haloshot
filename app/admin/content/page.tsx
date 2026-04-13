"use client";

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
  ExternalLink,
  FileText,
  Globe,
  Code,
  Info,
} from "lucide-react";

// Real blog posts from app/(marketing)/blog/[slug]/page.tsx
const blogPosts = [
  {
    slug: "what-your-linkedin-photo-is-really-saying",
    title: "What Your LinkedIn Photo Is Really Saying About You: We Scored 100 Profiles",
    category: "LinkedIn",
    date: "Apr 8, 2026",
  },
  {
    slug: "what-is-the-halo-effect",
    title: "What Is the Halo Effect and Why Your Profile Photo Exploits It",
    category: "Science",
    date: "Apr 5, 2026",
  },
  {
    slug: "linkedin-photo-tips",
    title: "7 Things High-Scoring LinkedIn Photos Have in Common",
    category: "LinkedIn",
    date: "Apr 2, 2026",
  },
  {
    slug: "best-linkedin-headshot-tips-2026",
    title: "The Complete Guide to LinkedIn Headshots in 2026",
    category: "LinkedIn",
    date: "Mar 28, 2026",
  },
  {
    slug: "ai-headshots-vs-photographer",
    title: "AI Headshots vs. Professional Photographer: An Honest Comparison",
    category: "Comparison",
    date: "Mar 21, 2026",
  },
];

// Real pages from sitemap.xml
const sitePages = [
  { path: "/", title: "Homepage", priority: "1.0" },
  { path: "/score", title: "Halo Score", priority: "0.9" },
  { path: "/science", title: "The Science", priority: "0.8" },
  { path: "/pricing", title: "Pricing", priority: "0.8" },
  { path: "/examples", title: "Examples Gallery", priority: "0.8" },
  { path: "/for/linkedin", title: "For LinkedIn", priority: "0.8" },
  { path: "/for/dating", title: "For Dating", priority: "0.7" },
  { path: "/for/founders", title: "For Founders", priority: "0.7" },
  { path: "/for/real-estate", title: "For Real Estate", priority: "0.7" },
  { path: "/for/teams", title: "For Teams", priority: "0.7" },
  { path: "/compare/headshotpro", title: "vs HeadshotPro", priority: "0.7" },
  { path: "/compare/aragon", title: "vs Aragon", priority: "0.7" },
  { path: "/compare/betterpic", title: "vs BetterPic", priority: "0.7" },
  { path: "/compare", title: "Comparisons", priority: "0.7" },
  { path: "/blog", title: "Blog Index", priority: "0.6" },
  { path: "/contact", title: "Contact", priority: "0.5" },
];

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <div>
          <h2 className="text-2xl font-display font-bold">Content</h2>
          <p className="text-sm text-muted-foreground">
            Blog posts, SEO pages, and site content
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 flex items-start gap-3">
        <Code className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-blue-300">Content is managed in code, not a CMS</p>
          <p className="text-xs text-blue-400/70 mt-0.5">
            Blog posts are defined in <code className="font-mono">app/(marketing)/blog/[slug]/page.tsx</code>.
            Pages are defined as Next.js routes. Edit the source code to update content.
          </p>
        </div>
      </div>

      <Tabs defaultValue="blog" className="space-y-4">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger
            value="blog"
            className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400 gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            Blog Posts ({blogPosts.length})
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400 gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            Site Pages ({sitePages.length})
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
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.slug} className="border-border">
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
                          className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/20"
                        >
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {post.date}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border bg-card border-dashed mt-4">
            <CardContent className="py-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Blog posts are hardcoded in the codebase
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Edit <code className="font-mono">app/(marketing)/blog/[slug]/page.tsx</code> to add or update posts.
                A CMS integration can be added later.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Pages Tab */}
        <TabsContent value="seo">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Page</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Sitemap Priority</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sitePages.map((page) => (
                    <TableRow key={page.path} className="border-border">
                      <TableCell>
                        <p className="text-sm font-medium">{page.title}</p>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                          {page.path}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            parseFloat(page.priority) >= 0.8
                              ? "bg-lime-400/10 text-lime-400 border-lime-400/20"
                              : parseFloat(page.priority) >= 0.6
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          )}
                        >
                          {page.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border bg-card border-dashed mt-4">
            <CardContent className="py-10 text-center">
              <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Pages are defined as Next.js routes in the <code className="font-mono">app/</code> directory
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sitemap is at <code className="font-mono">public/sitemap.xml</code>.
                Update it when adding new public pages.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
