"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Mail, Crown, Shield, User, MoreHorizontal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const mockMembers = [
  { id: "1", name: "Saahil Goel", email: "saahil@haloshot.app", role: "owner", status: "accepted", generationsCount: 24 },
  { id: "2", name: "Priya Sharma", email: "priya@haloshot.app", role: "admin", status: "accepted", generationsCount: 18 },
  { id: "3", name: "Rahul Kumar", email: "rahul@haloshot.app", role: "member", status: "accepted", generationsCount: 12 },
  { id: "4", name: "", email: "ananya@company.com", role: "member", status: "pending", generationsCount: 0 },
];

const roleIcons: Record<string, typeof Crown> = {
  owner: Crown,
  admin: Shield,
  member: User,
};

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInvite = () => {
    // API call to invite member
    setInviteEmail("");
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText("https://haloshot.app/team/invite/abc123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Team</h1>
          <p className="text-white/50 mt-1">Manage your team members and settings</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Send an invite via email or share the invite link.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button onClick={handleInvite} className="bg-violet-600 hover:bg-violet-700 gap-2">
                  <Mail className="h-4 w-4" />
                  Send
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-white/30">or share link</span>
                </div>
              </div>
              <Button variant="outline" onClick={copyInviteLink} className="w-full gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Invite Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Members", value: "4", icon: Users },
          { label: "Active", value: "3", icon: User },
          { label: "Total Generations", value: "54", icon: Users },
          { label: "Plan", value: "Team", icon: Crown },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/[0.03] border-white/10">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members list */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Members</CardTitle>
          <CardDescription>{mockMembers.length} members in your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockMembers.map((member, index) => {
              const RoleIcon = roleIcons[member.role] || User;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-xl p-3 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-violet-500/20 text-violet-400 text-sm">
                        {member.name ? member.name.split(" ").map(n => n[0]).join("") : member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {member.name || member.email}
                      </p>
                      <p className="text-xs text-white/40">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/30 hidden md:block">
                      {member.generationsCount} headshots
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs gap-1 border-0",
                        member.status === "pending"
                          ? "bg-amber-500/20 text-amber-400"
                          : member.role === "owner"
                          ? "bg-violet-500/20 text-violet-400"
                          : "bg-white/5 text-white/50"
                      )}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {member.status === "pending" ? "Pending" : member.role}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center">
                          <MoreHorizontal className="h-4 w-4 text-white/40" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem>View Headshots</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Brand settings placeholder */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Brand Settings</CardTitle>
          <CardDescription>Configure consistent styling for team headshots</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/60 mb-1 block">Default Style</label>
              <Button variant="outline" className="w-full justify-start">Corporate Team</Button>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">Default Background</label>
              <Button variant="outline" className="w-full justify-start">Standard Gray</Button>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1 block">Brand Guidelines</label>
            <textarea
              placeholder="Add any specific brand requirements (e.g., no visible logos, specific color backgrounds)"
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder:text-white/30 resize-none h-24 focus:outline-none focus:border-violet-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
