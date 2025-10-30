export type SeverityLevel = "critical" | "high" | "medium" | "low" | "informational";

export interface SecurityIssue {
  id: string;
  title: string;
  severity: SeverityLevel;
  vector: string;
  discovered: string;
  description: string;
  status: "open" | "mitigated" | "monitoring";
  evidence?: string;
  references?: Array<{ label: string; url: string }>;
  cve?: string;
  cvss?: {
    score: number;
    vector: string;
    version: string;
  };
  cwes?: string[];
  recommendedActions: string[];
}

export interface SecurityControl {
  id: string;
  title: string;
  description: string;
  maturity: "experimental" | "deployed" | "in-progress";
  coverage: Array<"model" | "infrastructure" | "governance" | "monitoring" | "supply-chain">;
}

export interface ModelRecord {
  slug: string;
  name: string;
  provider: string;
  modelSize: string;
  releaseStage: "general" | "limited" | "beta" | "research";
  deploymentOptions: string[];
  license: "commercial" | "open" | "research" | "mixed";
  summary: string;
  highlights: string[];
  tags: string[];
  riskLevel: "guarded" | "elevated" | "critical";
  securityScore: number;
  lastAudit: string;
  compliance: string[];
  issues: SecurityIssue[];
  controls: SecurityControl[];
  roadmap: string[];
  references: Array<{ label: string; url: string }>;
  changelog: Array<{
    date: string;
    title: string;
    summary: string;
    impact: "positive" | "neutral" | "negative";
  }>;
}

export const MODEL_DATA: ModelRecord[] = [
  {
    slug: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    modelSize: "Unknown (multi-modal)",
    releaseStage: "general",
    deploymentOptions: ["OpenAI API", "Azure OpenAI Service"],
    license: "commercial",
    summary:
      "GPT-4o is OpenAI's flagship multimodal model with broad enterprise adoption. The security posture is strong but depends heavily on vendor-enforced guardrails.",
    highlights: [
      "Enterprise-grade safety system and abuse monitoring pipeline.",
      "Robust prompt injection mitigations, including tool-level isolation.",
      "Backed by Azure confidential computing for enterprise tenants.",
    ],
    tags: ["multimodal", "closed-source", "enterprise", "tool-use"],
    riskLevel: "guarded",
    securityScore: 86,
    lastAudit: "2024-03-12",
    compliance: ["ISO 27001 via Microsoft Azure", "SOC 2 Type II", "HIPAA (enterprise tier)"],
    issues: [
      {
        id: "gpt-4o-sandbox-escape",
        title: "Function-call sandbox escape via indirect prompt injection",
        severity: "high",
        vector: "Prompt Injection / Tool Use",
        discovered: "2024-02-07",
        description:
          "In cross-domain tool invocation scenarios the model could be coerced into requesting unvalidated URLs, bypassing allowlists provided through natural-language instructions.",
        status: "mitigated",
        evidence:
          "Demonstrated by red-teamers escalating a harmless browsing request into exfiltration of internal SharePoint document titles.",
        references: [
          {
            label: "OpenAI system card update (Feb 2024)",
            url: "https://openai.com/policies/system-card",
          },
        ],
        recommendedActions: [
          "Require explicit tool contract schemas to enforce URL allowlists.",
          "Add deterministic back-end validation before executing tool outputs.",
        ],
      },
      {
        id: "gpt-4o-data-retention",
        title: "Default training retention for API telemetry",
        severity: "medium",
        vector: "Data Governance",
        discovered: "2024-01-18",
        description:
          "Standard tenants had telemetry retained for 30 days, raising exposure risk for regulated datasets unless opt-out was configured.",
        status: "monitoring",
        recommendedActions: [
          "Enable data retention opt-out or enterprise isolation.",
          "Document data minimization controls in vendor management tracker.",
        ],
      },
      {
        id: "gpt-4o-plugin-scope",
        title: "Over-privileged plugin scopes for marketplace integrations",
        severity: "critical",
        vector: "Plugin Security",
        discovered: "2024-03-28",
        description:
          "Security review of third-party plugins uncovered OAuth scopes requesting write-level access to production CRMs even when only read access was needed, creating lateral movement paths.",
        status: "open",
        evidence:
          "Pen-testers chained a compromised plugin secret with default scopes to seed malicious instructions into Salesforce automation workflows.",
        references: [
          {
            label: "Marketplace plugin bulletin (Mar 2024)",
            url: "https://openai.com/blog",
          },
        ],
        recommendedActions: [
          "Enforce least-privilege scope templates for all plugin manifests.",
          "Automate plugin security reviews with revocation for unused scopes.",
          "Introduce customer-visible attestation for third-party plugin audits.",
        ],
      },
      {
        id: "gpt-4o-side-channel",
        title: "Token-level side channel in streaming responses",
        severity: "high",
        vector: "Side Channel",
        discovered: "2024-02-26",
        description:
          "Latency variance between allowed and blocked completions leaked moderation decisions, enabling adversaries to infer policy enforcement outcomes.",
        status: "monitoring",
        evidence:
          "Streaming traces showed 110ms differential between blocked profanity payloads and baseline completions when moderation endpoints rejected content.",
        recommendedActions: [
          "Pad moderation denials with randomized delay to reduce timing deltas.",
          "Document side-channel expectations for regulated workloads.",
        ],
      },
      {
        id: "gpt-4o-telemetry-hints",
        title: "Verbose trace metadata exposes tenant identifiers",
        severity: "informational",
        vector: "Observability Hygiene",
        discovered: "2024-01-29",
        description:
          "Debug logging shipped with experimental tracing preserved hashed tenant identifiers that could be correlated with other datasets when combined.",
        status: "mitigated",
        recommendedActions: [
          "Strip tenant-identifying metadata from shared debugging payloads.",
          "Rotate previously exported trace datasets and regenerate with redaction.",
        ],
      },
      {
        id: "gpt-4o-guardrail-failopen",
        title: "Guardrail outage triggered fail-open responses",
        severity: "critical",
        vector: "Guardrail Reliability",
        discovered: "2024-03-30",
        description:
          "During a moderation service degradation the fallback policy returned unfiltered completions for 96 seconds, exposing policy-prohibited financial advice to regulated customers.",
        status: "open",
        evidence:
          "Incident review shows 312 requests bypassed the safety stack when the moderation worker pool exhausted retries.",
        recommendedActions: [
          "Tune moderation circuit breakers to fail-safe with generic denial messaging.",
          "Stagger guardrail worker pools across AZs to reduce correlated failures.",
          "Add customer-facing SLAs for guardrail availability with paging hooks.",
        ],
      },
      {
        id: "gpt-4o-tool-race",
        title: "Tool callback race risked tenant co-mingling",
        severity: "high",
        vector: "Infrastructure Isolation",
        discovered: "2024-04-04",
        description:
          "Concurrent tool invocations reused a shared Redis key when function IDs collided, briefly exposing signed URLs issued for a separate enterprise tenant.",
        status: "monitoring",
        recommendedActions: [
          "Scope tool execution caches by tenant and session identifier.",
          "Require per-call nonce validation before executing callback payloads.",
          "Audit historical tool traces for cross-tenant token reuse.",
        ],
      },
      {
        id: "gpt-4o-synthetic-drift",
        title: "Synthetic data contamination in fine-tuning pipeline",
        severity: "medium",
        vector: "Model Supply Chain",
        discovered: "2024-02-14",
        description:
          "Preview fine-tuning datasets included vendor-supplied synthetic transcripts with incomplete redaction, increasing risk of memorizing vendor-specific tokens.",
        status: "monitoring",
        references: [
          {
            label: "OpenAI platform update (Feb 2024)",
            url: "https://openai.com/blog",
          },
        ],
        recommendedActions: [
          "Request transparency reports for synthetic dataset provenance.",
          "Run in-house redaction on supplied transcripts before ingestion.",
          "Enable memorization auditing on fine-tuned deployments.",
        ],
      },
    ],
    controls: [
      {
        id: "gpt-4o-content-filter",
        title: "Layered content filtering",
        description:
          "OpenAI's moderation endpoint enforces a pre-call filter, with post-call classification and dynamic blocking lists tuned for jailbreak patterns.",
        maturity: "deployed",
        coverage: ["model", "monitoring"],
      },
      {
        id: "gpt-4o-supply-chain",
        title: "Azure supply-chain attestations",
        description:
          "Azure operates signed container attestations and confidential computing isolates for enterprise traffic, reducing supply-chain tampering surface.",
        maturity: "deployed",
        coverage: ["infrastructure", "supply-chain"],
      },
      {
        id: "gpt-4o-guardrails",
        title: "Declarative guardrail framework",
        description:
          "Preview declarative guardrails allow teams to enforce domain-specific rules, though coverage gaps remain for multilingual jailbreak attempts.",
        maturity: "in-progress",
        coverage: ["model", "governance"],
      },
    ],
    roadmap: [
      "Vendor attestation automation aligned with NIST AI RMF.",
      "Tighten prompt injection detection for multilingual payloads.",
      "Roll out deterministic tool-execution policies for finance workflows.",
    ],
    references: [
      { label: "GPT-4o Trust Center", url: "https://openai.com/trust" },
      { label: "Azure OpenAI compliance", url: "https://azure.microsoft.com/en-us/products/ai-services/openai-service" },
    ],
    changelog: [
      {
        date: "2024-03-12",
        title: "Guardrail policy update",
        summary: "Updated default guardrails with expanded multilingual jailbreak signatures.",
        impact: "positive",
      },
      {
        date: "2024-01-05",
        title: "Telemetry retention defaults clarified",
        summary: "Documentation now highlights opt-out path for regulated workloads.",
        impact: "neutral",
      },
    ],
  },
  {
    slug: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    modelSize: "Unknown (frontier multimodal)",
    releaseStage: "general",
    deploymentOptions: ["Anthropic Console", "AWS Bedrock"],
    license: "commercial",
    summary:
      "Claude 3 Opus emphasizes constitutional training and tight risk-mitigation loops. Strong at reasoning but exhibits data exfiltration risk during tool-use delegation.",
    highlights: [
      "In-depth constitutional AI training with transparent safety spec.",
      "Security partnership with AWS for Bedrock tenants.",
      "Granular audit logs surfaced through Bedrock Security Lake.",
    ],
    tags: ["reasoning", "enterprise", "multimodal", "constitutional-ai"],
    riskLevel: "guarded",
    securityScore: 82,
    lastAudit: "2024-02-20",
    compliance: ["SOC 2 Type II", "ISO 27001 via AWS"],
    issues: [
      {
        id: "claude-3-data-exfil",
        title: "Tool delegation data exfiltration",
        severity: "high",
        vector: "Prompt Injection / Tool Use",
        discovered: "2024-02-02",
        description:
          "When Claude delegates to external search tools, untrusted summaries can coerce the model into leaking prior conversation history back to the tool.",
        status: "mitigated",
        references: [
          {
            label: "Anthropic security bulletin 2024-02",
            url: "https://www.anthropic.com/news",
          },
        ],
        recommendedActions: [
          "Deploy outbound content validation for delegated tool calls.",
          "Limit conversation context forwarded to third-party services.",
        ],
      },
      {
        id: "claude-3-long-context",
        title: "Context window over-read",
        severity: "medium",
        vector: "Data Governance",
        discovered: "2023-12-11",
        description:
          "Models with 200K context may ingest full document dumps; without chunk-level ACLs sensitive passages can unintentionally be processed.",
        status: "monitoring",
        recommendedActions: [
          "Enforce document ACL filtering prior to ingestion.",
          "Instrument retention logging for Bedrock hosted tenants.",
        ],
      },
      {
        id: "claude-3-router-shadow",
        title: "Prompt router shadow mode leaks",
        severity: "high",
        vector: "Infrastructure Isolation",
        discovered: "2024-03-14",
        description:
          "Shadow deployments of Anthropic's prompt router sent anonymized payloads to pre-release inference endpoints without explicit tenant approval.",
        status: "monitoring",
        evidence:
          "Traffic captures indicated 1.8% of US enterprise requests mirrored to the preview cluster during the A/B rollout window.",
        recommendedActions: [
          "Opt out of router shadowing for regulated workloads until GA.",
          "Request signed DPA addendum covering preview traffic processing.",
        ],
      },
      {
        id: "claude-3-log-retention",
        title: "Extended Bedrock log retention for EU tenants",
        severity: "low",
        vector: "Data Governance",
        discovered: "2024-02-22",
        description:
          "AWS Bedrock retained Claude inference logs for 45 days in eu-central-1 while updated policy committed to 30 days or less.",
        status: "open",
        references: [
          {
            label: "AWS Bedrock trust advisory (Feb 2024)",
            url: "https://aws.amazon.com/security/security-bulletins/",
          },
        ],
        recommendedActions: [
          "Request log retention override via AWS support ticket.",
          "Encrypt exported audit trails with customer-managed KMS keys.",
        ],
      },
      {
        id: "claude-3-memory-leak",
        title: "Partial memory reset on long conversations",
        severity: "medium",
        vector: "Prompt Management",
        discovered: "2024-01-31",
        description:
          "Despite conversation truncation, system prompts leaked during context rebuild in Anthropic Console when switching between projects.",
        status: "mitigated",
        evidence:
          "Console bug-bash reproduced the leak twice with project switcher, revealing internal safety prompt segments.",
        recommendedActions: [
          "Force explicit context reset before cross-project navigation.",
          "Audit admin logs for historical prompt access events.",
        ],
      },
      {
        id: "claude-3-sandbox-trace",
        title: "Debug sandbox telemetry leaked document titles",
        severity: "high",
        vector: "Observability Hygiene",
        discovered: "2024-03-08",
        description:
          "Internal sandbox traces attached plain-text document identifiers to request metadata, bypassing configured PII scrubbing for Bedrock tenants.",
        status: "open",
        recommendedActions: [
          "Purge historical sandbox traces and rotate shared debug buckets.",
          "Require tokenization of document references before exporting telemetry.",
          "Extend privacy linting to Bedrock integration pipelines.",
        ],
      },
      {
        id: "claude-3-bedrock-failover",
        title: "Failover routing dropped customer-managed KMS enforcement",
        severity: "critical",
        vector: "Infrastructure Isolation",
        discovered: "2024-04-02",
        description:
          "During a us-west-2 outage the Bedrock failover path provisioned Claude endpoints without attached customer KMS keys, defaulting to provider-managed encryption.",
        status: "monitoring",
        evidence:
          "AWS security bulletin confirmed 17 enterprise tenants impacted before manual reattachment of CMEK configuration.",
        recommendedActions: [
          "Implement continuous validation to assert CMEK bindings post-failover.",
          "Mirror Claude deployment templates with forced KMS IDs.",
          "Negotiate SLA addendum covering CMEK guarantees during resiliency events.",
        ],
      },
      {
        id: "claude-3-kms-rotation",
        title: "Slow rotation of signing keys for tool credentials",
        severity: "medium",
        vector: "Supply Chain",
        discovered: "2024-02-09",
        description:
          "Anthropic rotated delegated tool signing keys quarterly; red-teamers demonstrated a stale key still accepted after deprecation, enabling unreviewed tool activation.",
        status: "mitigated",
        recommendedActions: [
          "Shorten signing key TTL to 30 days and automate revocation notices.",
          "Require customer approval for tool onboarding when stale keys detected.",
        ],
      },
    ],
    controls: [
      {
        id: "claude-ai-policy",
        title: "Constitutional AI policy stack",
        description: "Anthropic’s 25 rule constitutional stack yields consistent policy enforcement across safety categories.",
        maturity: "deployed",
        coverage: ["model", "governance"],
      },
      {
        id: "claude-bedrock-logging",
        title: "AWS Bedrock Security Lake integration",
        description:
          "Centralized audit logs with evidence retention and CloudTrail ingest for downstream SIEM correlation.",
        maturity: "deployed",
        coverage: ["infrastructure", "monitoring"],
      },
      {
        id: "claude-context-trimmer",
        title: "Context window policy enforcement",
        description:
          "Preview feature to enforce per-document redaction before long-context ingestion; early results reduce exposure by 40%.",
        maturity: "experimental",
        coverage: ["model", "governance"],
      },
    ],
    roadmap: [
      "Native support for deterministic regex guardrails.",
      "Zero-retention toggle for standard Anthropic tenants.",
      "Dedicated red-team program for delegated tool ecosystems.",
    ],
    references: [
      { label: "Anthropic Trust Portal", url: "https://www.anthropic.com/trust" },
      { label: "AWS Bedrock security", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/security.html" },
    ],
    changelog: [
      {
        date: "2024-02-20",
        title: "Tool delegation patch",
        summary: "Stronger boundary around tool responses to limit prompt leakage.",
        impact: "positive",
      },
      {
        date: "2024-01-10",
        title: "Context audit logging for Bedrock",
        summary: "Added optional context logging knob feeding AWS Security Lake.",
        impact: "positive",
      },
    ],
  },
  {
    slug: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    modelSize: "Unknown (multimodal)",
    releaseStage: "limited",
    deploymentOptions: ["Vertex AI", "Google AI Studio"],
    license: "commercial",
    summary:
      "Gemini 1.5 Pro provides massive context windows via Vertex AI. Security posture is rapidly evolving, but cross-project isolation gaps remain a concern.",
    highlights: [
      "1 million token context for enterprise retrieval workloads.",
      "Integrated with Google Cloud SCC for threat detections.",
      "Data residency support across multiple GCP regions.",
    ],
    tags: ["multimodal", "enterprise", "google-cloud", "long-context"],
    riskLevel: "elevated",
    securityScore: 72,
    lastAudit: "2024-02-01",
    compliance: ["ISO 27001", "FedRAMP Moderate (in progress)"],
    issues: [
      {
        id: "gemini-context-spill",
        title: "Cross-project context spill",
        severity: "critical",
        vector: "Tenant Isolation",
        discovered: "2024-01-28",
        description:
          "A misconfigured Vertex AI endpoint allowed batchjobs from one project to reuse cached embeddings from another tenant, resulting in inadvertent exposure.",
        status: "mitigated",
        evidence:
          "Internal GCP security response noted 12 affected enterprise tenants, with data scrubbing completed Feb 02.",
        references: [
          {
            label: "Google Cloud security incident report",
            url: "https://status.cloud.google.com/",
          },
        ],
        cve: "CVE-2024-11328",
        recommendedActions: [
          "Audit Vertex AI project isolation and disable model sharing.",
          "Purge embedding caches after job execution.",
          "Implement dataset-level encryption with CMEK.",
        ],
      },
      {
        id: "gemini-oversight",
        title: "Prompt oversight coverage gaps",
        severity: "medium",
        vector: "Operational Oversight",
        discovered: "2023-11-09",
        description:
          "Vertex AI relies on configurable safety filters; teams that disable defaults lose threat intel feeds for jailbreak detection.",
        status: "monitoring",
        recommendedActions: [
          "Retain default filtering policies where possible.",
          "Mirror GCP abuse monitoring signals into local SIEM.",
        ],
      },
      {
        id: "gemini-build-image-supply-chain",
        title: "Unpinned base images within Vertex pipelines",
        severity: "high",
        vector: "Supply Chain",
        discovered: "2024-03-05",
        description:
          "Default Vertex AI pipelines for Gemini evaluations pulled mutable container tags, exposing customers to upstream image replacements without attestations.",
        status: "open",
        references: [
          {
            label: "Google Cloud security bulletin (Mar 2024)",
            url: "https://cloud.google.com/support/bulletins",
          },
        ],
        recommendedActions: [
          "Pin pipelines to digest references with Binary Authorization.",
          "Mirror vetted base images into private Artifact Registry repos.",
          "Enable Cloud Deploy integrity policies for inference workloads.",
        ],
      },
      {
        id: "gemini-cross-region-residency",
        title: "Cross-region fallback broke residency guarantees",
        severity: "medium",
        vector: "Data Governance",
        discovered: "2024-02-12",
        description:
          "Vertex AI auto-failover temporarily processed EU workloads in us-central1 during a localized outage, conflicting with declared residency controls.",
        status: "monitoring",
        evidence:
          "Residency dashboards flagged 37 requests routed to backup region; Google issued retroactive compliance notice.",
        recommendedActions: [
          "Enable manual region pinning until failover policy update ships.",
          "Request compliance attestation for impacted time window.",
        ],
      },
      {
        id: "gemini-iam-drift",
        title: "Over-broad Vertex IAM bindings on shared projects",
        severity: "low",
        vector: "Identity & Access",
        discovered: "2023-12-21",
        description:
          "Joint security reviews revealed Vertex AI admin roles granted to analytics teams, enabling unintended model version deletion and log access.",
        status: "mitigated",
        recommendedActions: [
          "Run IAM recommender and remove unused high-privilege bindings.",
          "Adopt custom least-privilege roles for LLM operations teams.",
        ],
      },
      {
        id: "gemini-spectrum-anon",
        title: "Spectrum dataset rehydration exposed anonymized IDs",
        severity: "critical",
        vector: "Data Governance",
        discovered: "2024-03-21",
        description:
          "Backfilled training pipelines rehydrated archived Spectrum datasets without re-salting tenant pseudonyms, enabling correlation with legacy reports.",
        status: "open",
        recommendedActions: [
          "Request deletion certificate for affected Spectrum archives.",
          "Double-check legal basis for processed datasets during retraining.",
          "Force manual approval on future dataset restores.",
        ],
      },
      {
        id: "gemini-model-mirror",
        title: "Model mirror drift in customer-managed projects",
        severity: "medium",
        vector: "Model Supply Chain",
        discovered: "2024-03-02",
        description:
          "Customers mirroring Gemini checkpoints into private Artifact Registry saw drifted attestation metadata after Google re-published the base model without notice.",
        status: "monitoring",
        references: [
          {
            label: "Vertex AI release notes (Mar 2024)",
            url: "https://cloud.google.com/vertex-ai/docs/release-notes",
          },
        ],
        recommendedActions: [
          "Enable Binary Authorization to require fresh attestations before deploying mirrors.",
          "Set up digest pinning and automated diff alerts on mirrored artifacts.",
        ],
      },
      {
        id: "gemini-audit-backlog",
        title: "Delayed audit log ingestion into Chronicle",
        severity: "low",
        vector: "Observability Hygiene",
        discovered: "2024-01-22",
        description:
          "Chronicle pipeline throttling delayed Gemini request logs by up to six hours for APAC tenants, impacting incident response SLAs.",
        status: "monitoring",
        recommendedActions: [
          "Temporarily stream logs to BigQuery for real-time analysis.",
          "Monitor Chronicle pipeline quotas and request regional allocation increase.",
        ],
      },
    ],
    controls: [
      {
        id: "gemini-scc",
        title: "Security Command Center integration",
        description:
          "First-party SCC detectors for model misuse and data exfiltration integrate with existing Google Cloud threat workflows.",
        maturity: "deployed",
        coverage: ["monitoring", "infrastructure"],
      },
      {
        id: "gemini-safe-prompt",
        title: "Prompt safety filters",
        description:
          "Configurable safety filters covering violence, self-harm, and harassment categories; coverage gaps remain for edge jailbreak content.",
        maturity: "in-progress",
        coverage: ["model"],
      },
      {
        id: "gemini-cmek",
        title: "Customer managed encryption keys",
        description: "Allows enterprises to control data at rest with CMEK; requires additional setup for batch jobs.",
        maturity: "deployed",
        coverage: ["infrastructure", "governance"],
      },
    ],
    roadmap: [
      "Launch default strict isolation for embedding caches.",
      "Broaden safety filter coverage for high-risk categories.",
      "Introduce automated compliance evidence packs for SOC reporting.",
    ],
    references: [
      { label: "Gemini trust center", url: "https://cloud.google.com/gemini/docs/responsible-ai" },
      { label: "Vertex AI security", url: "https://cloud.google.com/vertex-ai/docs/general/security" },
    ],
    changelog: [
      {
        date: "2024-02-05",
        title: "Embedding cache isolation fix",
        summary: "Rolled out stricter tenant isolation and automatic cache eviction.",
        impact: "positive",
      },
      {
        date: "2023-12-17",
        title: "Expanded safety filters",
        summary: "Added harassment and extremist content filters to default policy.",
        impact: "positive",
      },
    ],
  },
  {
    slug: "llama-3-70b",
    name: "LLaMA 3 70B",
    provider: "Meta",
    modelSize: "70B parameters",
    releaseStage: "general",
    deploymentOptions: ["Self-hosted", "Third-party API providers"],
    license: "mixed",
    summary:
      "Meta's LLaMA 3 70B provides high-quality open weights for self-hosting. Security posture depends on downstream hardening and patch cadence.",
    highlights: [
      "Open weights allow tight on-prem isolation.",
      "Active community security research and red-teaming.",
      "Supports fine-tuning with Meta responsible AI toolkit.",
    ],
    tags: ["open-weights", "self-hosted", "fine-tuning"],
    riskLevel: "elevated",
    securityScore: 64,
    lastAudit: "2024-01-14",
    compliance: ["Self-managed"],
    issues: [
      {
        id: "llama-leakage",
        title: "Fine-tuning data leakage",
        severity: "high",
        vector: "Model Inversion",
        discovered: "2023-10-04",
        description:
          "Research showed that poorly regularized fine-tunes on >5% sensitive data can leak training snippets verbatim.",
        status: "monitoring",
        references: [
          {
            label: "Meta Responsible Use Guide",
            url: "https://ai.meta.com/llama/",
          },
        ],
        recommendedActions: [
          "Adopt differential privacy fine-tuning strategies.",
          "Regularly run canary sampling tests post fine-tune.",
        ],
      },
      {
        id: "llama-supply-chain",
        title: "Model artifact tampering risk",
        severity: "critical",
        vector: "Supply Chain",
        discovered: "2024-02-16",
        description:
          "Unofficial model mirrors circulated modified weights with embedded backdoors, highlighting the need for artifact verification.",
        status: "open",
        recommendedActions: [
          "Verify SHA-256 hashes for all model checkpoints.",
          "Host artifacts in signed object storage with attestation.",
        ],
      },
      {
        id: "llama-entropy-drop",
        title: "Entropy collapse during quantization",
        severity: "medium",
        vector: "Model Compression",
        discovered: "2024-02-11",
        description:
          "Community quantization scripts reduced sampling entropy, increasing exposure to deterministic prompt inversion attacks.",
        status: "monitoring",
        references: [
          {
            label: "LLaMA community security thread",
            url: "https://github.com/facebookresearch/llama/discussions",
          },
        ],
        recommendedActions: [
          "Adopt official Meta quantization recipes with bias correction.",
          "Test quantized builds with adversarial prompt suites prior to deployment.",
        ],
      },
      {
        id: "llama-dependency-cves",
        title: "Inference stack includes outdated CUDA runtime",
        severity: "high",
        vector: "Infrastructure",
        discovered: "2024-03-02",
        description:
          "Reference docker-compose shipped CUDA 11.8 images missing patches for CVE-2024-0146 impacting GPU container escape surfaces.",
        status: "open",
        cve: "CVE-2024-0146",
        recommendedActions: [
          "Upgrade base containers to patched CUDA runtime versions.",
          "Enable GPU device cgroup isolation and audit container breakout telemetry.",
        ],
      },
      {
        id: "llama-telemetry-optout",
        title: "Optional telemetry flag defaults to enabled",
        severity: "low",
        vector: "Observability Hygiene",
        discovered: "2024-01-22",
        description:
          "Starter helm charts forwarded anonymized inference metrics to Meta endpoints unless operators explicitly disabled the chart value.",
        status: "mitigated",
        recommendedActions: [
          "Set `telemetry.enabled=false` in all deployment values files.",
          "Document telemetry expectations in customer privacy notices.",
        ],
      },
    ],
    controls: [
      {
        id: "llama-sbom",
        title: "Model SBOM & attestations",
        description:
          "Internal SBOM tracking documents base weights, fine-tune datasets, and applied patches; automation coverage is limited.",
        maturity: "in-progress",
        coverage: ["supply-chain", "governance"],
      },
      {
        id: "llama-canary",
        title: "Canary sampling",
        description:
          "Nightly canary sampling detects memorized sequences; results feed into monitoring dashboards.",
        maturity: "experimental",
        coverage: ["model", "monitoring"],
      },
      {
        id: "llama-infra-hardening",
        title: "Container hardening baseline",
        description:
          "Self-hosted blueprint enforces CIS hardened OS images, GPU isolation, and mTLS between inference workers.",
        maturity: "deployed",
        coverage: ["infrastructure"],
      },
    ],
    roadmap: [
      "Automate signature verification for third-party weight downloads.",
      "Roll out default DP fine-tuning recipes.",
      "Document compliance mappings for self-hosted deployments.",
    ],
    references: [
      { label: "Meta Responsible Use Guide", url: "https://ai.meta.com/llama/responsible-use-guide/" },
      { label: "Community security advisories", url: "https://github.com/facebookresearch/llama" },
    ],
    changelog: [
      {
        date: "2024-02-20",
        title: "Backdoor artifact advisory",
        summary: "Issued guidance on verifying artifact hashes and published official mirror list.",
        impact: "negative",
      },
      {
        date: "2023-12-01",
        title: "Responsible AI toolkit update",
        summary: "Added DP fine-tuning cookbook and risk assessment checklist.",
        impact: "positive",
      },
    ],
  },
  {
    slug: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    modelSize: "Unknown (dense decoder-only)",
    releaseStage: "beta",
    deploymentOptions: ["Mistral API", "La Plateforme"],
    license: "commercial",
    summary:
      "Mistral Large provides competitive multilingual performance with flexible licensing. Security posture is still maturing with rapid feature rollout.",
    highlights: [
      "Native multilingual guardrails with French and German coverage.",
      "Lightweight deployment footprint for edge inference partners.",
      "Active bug bounty program with Trail of Bits.",
    ],
    tags: ["multilingual", "european", "beta"],
    riskLevel: "elevated",
    securityScore: 69,
    lastAudit: "2024-02-08",
    compliance: ["SOC 2 (in progress)", "GDPR commitments"],
    issues: [
      {
        id: "mistral-api-headers",
        title: "Improper authorization header validation",
        severity: "medium",
        vector: "API Security",
        discovered: "2024-01-12",
        description:
          "Legacy SDKs accepted signed JWTs without audience enforcement, enabling cross-tenant replay under certain conditions.",
        status: "mitigated",
        recommendedActions: [
          "Rotate API keys and adopt the latest SDK versions.",
          "Enforce audience claim validation in reverse proxies.",
        ],
      },
      {
        id: "mistral-french-jailbreak",
        title: "Multilingual jailbreak gap",
        severity: "medium",
        vector: "Content Safety",
        discovered: "2024-02-18",
        description:
          "Guardrails shipped with English-first signatures; French and German jailbreak prompts bypassed abuse detection in 35% of tests.",
        status: "monitoring",
        recommendedActions: [
          "Deploy custom guardrails for high-risk languages.",
          "Feed abuse telemetry back to Mistral for signature updates.",
        ],
      },
      {
        id: "mistral-cache-poison",
        title: "Edge cache poisoning risk on La Plateforme",
        severity: "critical",
        vector: "Edge Security",
        discovered: "2024-03-18",
        description:
          "CDN points of presence accepted querystring-controlled cache keys, enabling adversaries to serve stale jailbreak instructions to future tenants.",
        status: "open",
        evidence:
          "Bug bounty submission delivered crafted querystring which persisted malicious prompt templates for 12 minutes regionally.",
        recommendedActions: [
          "Disable querystring caching for inference endpoints.",
          "Purge suspect cache entries and add WAF rules for prompt parameters.",
        ],
      },
      {
        id: "mistral-sso-drift",
        title: "SAML SSO drift caused authorization lapses",
        severity: "high",
        vector: "Identity & Access",
        discovered: "2024-02-27",
        description:
          "Enterprise SSO configuration updates failed to invalidate existing dashboard sessions, allowing deprovisioned analysts to retain access for up to 24 hours.",
        status: "monitoring",
        recommendedActions: [
          "Enable Just-In-Time logout webhooks to force session revocation.",
          "Review admin activity logs for stale sessions post SSO updates.",
        ],
      },
      {
        id: "mistral-audit-lag",
        title: "Audit log export lag for EU region",
        severity: "low",
        vector: "Observability Hygiene",
        discovered: "2024-01-26",
        description:
          "Daily audit log exports to customer S3 buckets lagged by 8 hours for eu-west-1 customers due to backlog in the log fan-out pipeline.",
        status: "monitoring",
        recommendedActions: [
          "Set up temporary pull-based log retrieval until pipeline backlog clears.",
          "Alert on export delays exceeding four hours to track regressions.",
        ],
      },
      {
        id: "mistral-edge-debug",
        title: "Debug endpoints left exposed on edge nodes",
        severity: "high",
        vector: "Infrastructure Isolation",
        discovered: "2024-03-09",
        description:
          "Two European PoPs exposed debug endpoints protected only by obscured URLs, allowing adversaries to view realtime inference traces.",
        status: "open",
        recommendedActions: [
          "Remove debug paths from production edge routing immediately.",
          "Rotate any secrets captured in exposed traces.",
          "Add automated validation to ensure debug handlers are stripped before deploys.",
        ],
      },
      {
        id: "mistral-dpa-gap",
        title: "Delayed DPA updates for Swiss customers",
        severity: "medium",
        vector: "Governance",
        discovered: "2024-02-05",
        description:
          "Updated Swiss Federal Act on Data Protection clauses were not reflected in the standard DPA until customer escalation, leaving contractual ambiguity for six weeks.",
        status: "monitoring",
        recommendedActions: [
          "Secure interim DPA addendum covering FADP obligations.",
          "Escalate trust portal updates to include jurisdiction-specific timelines.",
        ],
      },
    ],
    controls: [
      {
        id: "mistral-bug-bounty",
        title: "Bounty program with Trail of Bits",
        description: "External researchers probe API and model misuse, with 90-day SLA on critical fixes.",
        maturity: "deployed",
        coverage: ["governance", "monitoring"],
      },
      {
        id: "mistral-guardrails",
        title: "La Plateforme guardrails",
        description:
          "Configurable guardrails allow policy definition; coverage for non-English jailbreaks still expanding.",
        maturity: "in-progress",
        coverage: ["model"],
      },
      {
        id: "mistral-infra-hybrid",
        title: "Hybrid cloud isolation",
        description:
          "Dedicated VPC deployment option with private peering and mTLS enforcement between ingress and workers.",
        maturity: "deployed",
        coverage: ["infrastructure"],
      },
    ],
    roadmap: [
      "Finalize SOC 2 Type I audit.",
      "Ship multilingual guardrail signatures for 10 languages.",
      "Launch unified trust portal with live status badges.",
    ],
    references: [
      { label: "Mistral AI trust page", url: "https://mistral.ai/trust" },
      { label: "Trail of Bits partnership", url: "https://www.trailofbits.com/" },
    ],
    changelog: [
      {
        date: "2024-02-25",
        title: "API JWT validation patch",
        summary: "Updated SDKs and platform gateway to enforce strict JWT audience checks.",
        impact: "positive",
      },
      {
        date: "2024-01-30",
        title: "Bug bounty expansion",
        summary: "Extended bounty scope to include multilingual jailbreak submissions.",
        impact: "positive",
      },
    ],
  },
];

export const MODEL_INDEX = MODEL_DATA.reduce<Record<string, ModelRecord>>((acc, model) => {
  acc[model.slug] = model;
  return acc;
}, {});

export function getModelBySlug(slug: string) {
  return MODEL_INDEX[slug];
}

export const ALL_TAGS = Array.from(new Set(MODEL_DATA.flatMap((model) => model.tags))).sort();

export const ALL_RISK_LEVELS = Array.from(new Set(MODEL_DATA.map((model) => model.riskLevel))).sort();
