"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Upload, Trash2, Loader2, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple tab implementation since we don't have shadcn tabs installed
function Tabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-secondary/50 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Simple switch component
function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-violet-500" : "bg-secondary"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, profile } = useUser();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  const fullName = profile?.full_name || user?.user_metadata?.full_name || "";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const email = user?.email || "";

  useEffect(() => setMounted(true), []);

  // Initialize name inputs when profile loads
  useEffect(() => {
    if (profile || user) {
      setFirstNameInput(firstName);
      setLastNameInput(lastName);
    }
  }, [profile, user, firstName, lastName]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    const newFullName = [firstNameInput, lastNameInput].filter(Boolean).join(" ");
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ full_name: newFullName })
      .eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const settingsTabs = [
    { id: "profile", label: "Profile" },
    { id: "appearance", label: "Appearance" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Fine-tune your HaloShot experience.
        </p>
      </div>

      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                The face behind the halo. Shown on your account and shared headshots.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
                {firstName.charAt(0) || "?"}
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                  Upload photo
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG or PNG. Max 2MB.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstNameInput}
                    onChange={(e) => setFirstNameInput(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={email}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email.
                </p>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-500"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Saved
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Dark mode is where the halo shines brightest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {mounted && theme === "dark" ? (
                    <Moon className="h-5 w-5 text-violet-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Dark mode</p>
                    <p className="text-xs text-muted-foreground">
                      {mounted
                        ? theme === "dark"
                          ? "Currently using dark theme"
                          : "Currently using light theme"
                        : "\u00A0"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={mounted ? theme === "dark" : false}
                  onCheckedChange={(dark) =>
                    setTheme(dark ? "dark" : "light")
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                Select your preferred language. <span className="text-violet-400 font-medium">Coming soon.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <select disabled className="rounded-md border border-input bg-background px-3 py-2 text-sm opacity-50 cursor-not-allowed">
                <option value="en">English</option>
              </select>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle>Download Your Data</CardTitle>
              <CardDescription>
                Take your glow-up with you. Get a copy of all your data including headshots and account info.
                <span className="text-violet-400 font-medium"> Coming soon.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled>Request data export</Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 opacity-60">
            <CardHeader>
              <CardTitle className="text-destructive">
                Delete Account
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data. Your halo disappears forever.
                <span className="text-violet-400 font-medium"> Coming soon.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled>
                <Trash2 className="h-4 w-4" />
                Delete account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
