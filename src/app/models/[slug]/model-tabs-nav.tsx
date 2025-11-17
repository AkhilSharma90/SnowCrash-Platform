"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModelTabsNavProps {
  slug: string;
  issueCount: number;
  controlCount: number;
}

const TAB_VALUES = new Set(["overview", "advisories", "controls", "signals", "roadmap", "evidence", "changelog"]);

export function ModelTabsNav({ slug, issueCount, controlCount }: ModelTabsNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const tabSegment = segments[2];
  const activeValue = tabSegment && TAB_VALUES.has(tabSegment) ? tabSegment : "overview";

  return (
    <Tabs
      defaultValue="overview"
      value={activeValue}
      onValueChange={(next) => {
        if (next === activeValue) {
          return;
        }

        const target = next === "overview" ? `/models/${slug}` : `/models/${slug}/${next}`;
        router.push(target);
      }}
      className="space-y-0"
    >
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="advisories">Advisories ({issueCount})</TabsTrigger>
        <TabsTrigger value="controls">Controls ({controlCount})</TabsTrigger>
        <TabsTrigger value="signals">Signal grading</TabsTrigger>
        <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        <TabsTrigger value="evidence">Evidence</TabsTrigger>
        <TabsTrigger value="changelog">Changelog</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
