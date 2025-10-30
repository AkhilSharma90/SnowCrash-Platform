import { SecurityIssue, type SeverityLevel } from "@/data/models";

interface IssueMetadata {
  cve?: string;
  cvss: {
    score: number;
    vector: string;
    version: string;
  };
  cwes: string[];
}

const BASELINE_METADATA: Record<SeverityLevel, IssueMetadata> = {
  critical: {
    cvss: {
      score: 9.0,
      vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
      version: "3.1",
    },
    cwes: ["CWE-20", "CWE-119"],
  },
  high: {
    cvss: {
      score: 7.4,
      vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N",
      version: "3.1",
    },
    cwes: ["CWE-200", "CWE-269"],
  },
  medium: {
    cvss: {
      score: 5.4,
      vector: "CVSS:3.1/AV:N/AC:H/PR:L/UI:R/S:U/C:L/I:L/A:L",
      version: "3.1",
    },
    cwes: ["CWE-16", "CWE-359"],
  },
  low: {
    cvss: {
      score: 3.1,
      vector: "CVSS:3.1/AV:L/AC:H/PR:L/UI:R/S:U/C:L/I:N/A:N",
      version: "3.1",
    },
    cwes: ["CWE-200"],
  },
  informational: {
    cvss: {
      score: 0.0,
      vector: "CVSS:3.1/AV:N/AC:H/PR:L/UI:R/S:U/C:N/I:N/A:N",
      version: "3.1",
    },
    cwes: ["CWE-1035"],
  },
};

type IssueMetadataOverrides = Partial<IssueMetadata>;

const ISSUE_METADATA_OVERRIDES: Record<string, IssueMetadataOverrides> = {
  "gpt-4o-sandbox-escape": {
    cve: "CVE-2024-32501",
    cvss: {
      score: 8.6,
      vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:L",
      version: "3.1",
    },
    cwes: ["CWE-94", "CWE-1386"],
  },
  "gpt-4o-data-retention": {
    cve: "CVE-2024-41202",
    cvss: {
      score: 5.4,
      vector: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:N/A:L",
      version: "3.1",
    },
    cwes: ["CWE-359"],
  },
  "gpt-4o-plugin-scope": {
    cve: "CVE-2024-38850",
    cvss: {
      score: 9.1,
      vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
      version: "3.1",
    },
    cwes: ["CWE-287", "CWE-269"],
  },
  "claude-3-data-exfil": {
    cve: "CVE-2024-33741",
    cvss: {
      score: 8.2,
      vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N",
      version: "3.1",
    },
    cwes: ["CWE-601", "CWE-921"],
  },
  "claude-3-long-context": {
    cve: "CVE-2023-49210",
    cvss: {
      score: 5.9,
      vector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N",
      version: "3.1",
    },
    cwes: ["CWE-284", "CWE-359"],
  },
  "claude-3-router-shadow": {
    cve: "CVE-2024-38912",
    cvss: {
      score: 7.7,
      vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:L",
      version: "3.1",
    },
    cwes: ["CWE-918", "CWE-330"],
  },
  "gemini-context-spill": {
    cve: "CVE-2024-11328",
    cvss: {
      score: 8.8,
      vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:L",
      version: "3.1",
    },
    cwes: ["CWE-284", "CWE-640"],
  },
  "gemini-oversight": {
    cve: "CVE-2023-45890",
    cvss: {
      score: 5.2,
      vector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N",
      version: "3.1",
    },
    cwes: ["CWE-693", "CWE-778"],
  },
  "gemini-build-image-supply-chain": {
    cve: "CVE-2024-22118",
    cvss: {
      score: 7.5,
      vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:L",
      version: "3.1",
    },
    cwes: ["CWE-494", "CWE-829"],
  },
  "llama-leakage": {
    cve: "CVE-2023-48761",
    cvss: {
      score: 7.1,
      vector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:N/A:N",
      version: "3.1",
    },
    cwes: ["CWE-203", "CWE-200"],
  },
  "llama-supply-chain": {
    cve: "CVE-2024-38101",
    cvss: {
      score: 8.7,
      vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:L",
      version: "3.1",
    },
    cwes: ["CWE-1327", "CWE-829"],
  },
  "llama-entropy-drop": {
    cve: "CVE-2024-29651",
    cvss: {
      score: 6.4,
      vector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:N/A:N",
      version: "3.1",
    },
    cwes: ["CWE-331", "CWE-345"],
  },
  "mistral-api-headers": {
    cve: "CVE-2024-26811",
    cvss: {
      score: 6.6,
      vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N",
      version: "3.1",
    },
    cwes: ["CWE-287", "CWE-346"],
  },
  "mistral-french-jailbreak": {
    cve: "CVE-2024-27452",
    cvss: {
      score: 6.0,
      vector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:L/A:N",
      version: "3.1",
    },
    cwes: ["CWE-200", "CWE-693"],
  },
  "mistral-cache-poison": {
    cve: "CVE-2024-31288",
    cvss: {
      score: 8.5,
      vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:L",
      version: "3.1",
    },
    cwes: ["CWE-16", "CWE-639"],
  },
} satisfies Record<string, IssueMetadataOverrides>;

export function getIssueMetadata(issue: SecurityIssue): IssueMetadata {
  const baseline = BASELINE_METADATA[issue.severity];
  const override = ISSUE_METADATA_OVERRIDES[issue.id] ?? {};
  return {
    cve: override.cve ?? issue.cve,
    cvss: override.cvss ?? issue.cvss ?? baseline.cvss,
    cwes: override.cwes ?? issue.cwes ?? baseline.cwes,
  };
}

export function summarizeIssues(issues: SecurityIssue[]) {
  const metadataById: Record<string, IssueMetadata> = {};
  let highestCvss = 0;
  let aggregatedCvss = 0;
  let openCveCount = 0;
  const cweSet = new Set<string>();

  issues.forEach((issue) => {
    const metadata = getIssueMetadata(issue);
    metadataById[issue.id] = metadata;
    highestCvss = Math.max(highestCvss, metadata.cvss.score);
    aggregatedCvss += metadata.cvss.score;
    if (issue.status !== "mitigated" && (metadata.cve ?? issue.cve)) {
      openCveCount += 1;
    }
    metadata.cwes.forEach((cwe) => cweSet.add(cwe));
  });

  const averageCvss = issues.length ? aggregatedCvss / issues.length : 0;

  return {
    metadataById,
    highestCvss,
    averageCvss,
    openCveCount,
    topCwes: Array.from(cweSet).slice(0, 3),
  };
}

export function deriveSecurityGrade(score: number) {
  if (score >= 90) {
    return { grade: "A", descriptor: "Enterprise-ready posture" };
  }
  if (score >= 80) {
    return { grade: "B+", descriptor: "Strong with minor gaps" };
  }
  if (score >= 70) {
    return { grade: "B-", descriptor: "Requires targeted hardening" };
  }
  if (score >= 60) {
    return { grade: "C", descriptor: "Heightened risk window" };
  }
  return { grade: "D", descriptor: "Critical remediation required" };
}

