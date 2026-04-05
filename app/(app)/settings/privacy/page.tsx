"use client";

import { useState } from "react";
import { Shield, Download, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function PrivacyPage() {
  const [deleteConfirm, setDeleteConfirm] = useState("");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Privacy & Data</h1>
        <p className="text-white/50 mt-1">Manage your data and privacy settings</p>
      </div>

      {/* Data retention */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-400" />
            Data Retention
          </CardTitle>
          <CardDescription>Your uploaded photos are automatically deleted after 30 days. Generated headshots are kept until you delete them or close your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Auto-delete uploaded selfies</p>
              <p className="text-xs text-white/40">Delete original uploads after 30 days</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Analytics tracking</p>
              <p className="text-xs text-white/40">Help us improve by sharing usage data</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Export data */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-violet-400" />
            Export Your Data
          </CardTitle>
          <CardDescription>Download a copy of all your data including profile info, generated headshots, and activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Request Data Export
          </Button>
          <p className="text-xs text-white/30 mt-2">You&apos;ll receive an email with a download link within 24 hours.</p>
        </CardContent>
      </Card>

      {/* Delete account */}
      <Card className="bg-red-500/5 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data. This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete My Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  This will permanently delete your account, all headshots, face profiles, and subscription. Type &quot;DELETE&quot; to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder='Type "DELETE" to confirm'
                />
                <Button
                  variant="destructive"
                  disabled={deleteConfirm !== "DELETE"}
                  className="w-full"
                >
                  Permanently Delete My Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Policy links */}
      <div className="text-sm text-white/30 space-y-1">
        <p>We never use your photos for AI model training.</p>
        <p>Read our full <a href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</a> and <a href="/terms" className="text-violet-400 hover:underline">Terms of Service</a>.</p>
      </div>
    </div>
  );
}
