import { type ModelRecord } from "./models";

export type SignalGradeLetter = "A" | "B" | "C" | "D" | "E";
export type SignalTrend = "improving" | "stable" | "regressing";
export type SignalReliability = "High" | "Medium" | "Low";

export interface SignalDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  dimension: string;
}

export interface ModelSignalGrade extends SignalDefinition {
  score: number;
  grade: SignalGradeLetter;
  reliability: SignalReliability;
  trend: SignalTrend;
  note: string;
}

export const SIGNAL_DEFINITIONS: SignalDefinition[] = [
  // Deception & Harm Propensity
  {
    id: "hidden-intent-leakage",
    title: "Hidden intent leakage",
    description: "Tests whether the model reveals concealed malicious planning steps after persistent probing.",
    category: "Deception & Harm Propensity",
    dimension: "Behavioural risk",
  },
  {
    id: "vindictive-response-shift",
    title: "Vindictive response shift",
    description: "Measures escalation or retaliatory tone when the model perceives moderation or criticism.",
    category: "Deception & Harm Propensity",
    dimension: "Conversation safety",
  },
  {
    id: "covert-tool-coordination",
    title: "Covert tool coordination",
    description: "Looks for attempts to orchestrate tools that the operator did not explicitly authorise.",
    category: "Deception & Harm Propensity",
    dimension: "Tool governance",
  },
  {
    id: "prompt-masking",
    title: "Prompt masking",
    description: "Rate of the model rewriting hostile instructions to hide from downstream detectors.",
    category: "Deception & Harm Propensity",
    dimension: "Prompt hygiene",
  },
  {
    id: "harmful-autonomy-ramp",
    title: "Harmful autonomy ramp",
    description: "Likelihood of the model independently sequencing steps that increase blast radius.",
    category: "Deception & Harm Propensity",
    dimension: "Operational discipline",
  },
  {
    id: "persona-imprinting",
    title: "Synthetic persona imprinting",
    description: "Observes if the model adopts persistent personas with relaxed ethical stances.",
    category: "Deception & Harm Propensity",
    dimension: "Identity control",
  },
  {
    id: "fraud-authority-mimicry",
    title: "Authority mimicry for fraud",
    description: "Measures ability to imitate executives, regulators, or specific employees convincingly.",
    category: "Deception & Harm Propensity",
    dimension: "Impersonation defence",
  },
  {
    id: "dual-use-playbook",
    title: "Dual-use playbook synthesis",
    description: "Checks for emergent capability to chain benign techniques into harmful payloads.",
    category: "Deception & Harm Propensity",
    dimension: "Mission engineering",
  },
  {
    id: "disposition-shift",
    title: "Disposition shift under scrutiny",
    description: "Tracks whether the model changes answers when a conversation references audits.",
    category: "Deception & Harm Propensity",
    dimension: "Oversight resilience",
  },
  {
    id: "self-justifying-overrides",
    title: "Self-justifying guardrail overrides",
    description: "Looks for cases where the model argues its way past the operator's explicit policy.",
    category: "Deception & Harm Propensity",
    dimension: "Policy adherence",
  },
  // Selective censorship
  {
    id: "policy-straddle-detection",
    title: "Policy straddle detection",
    description: "Detects when the model inconsistently applies borderline safety policies across prompts.",
    category: "Selective Censorship Controls",
    dimension: "Policy fidelity",
  },
  {
    id: "preference-mirroring",
    title: "Preference mirroring bias",
    description: "Assesses tendency to align moderation outcomes with a user's ideology or sentiment.",
    category: "Selective Censorship Controls",
    dimension: "Bias mitigation",
  },
  {
    id: "geofence-suppression",
    title: "Geofence suppression drift",
    description: "Tracks over-blocking of certain geographies while others are left unmoderated.",
    category: "Selective Censorship Controls",
    dimension: "Regional parity",
  },
  {
    id: "civic-equality",
    title: "Civic equality of treatment",
    description: "Measures whether political actors receive uneven access to persuasive language modes.",
    category: "Selective Censorship Controls",
    dimension: "Civic safeguards",
  },
  {
    id: "religious-minority-expression",
    title: "Religious minority expression",
    description: "Assesses false positives when minority traditions describe legitimate practices.",
    category: "Selective Censorship Controls",
    dimension: "Cultural resilience",
  },
  {
    id: "historical-memory-rewrite",
    title: "Historical memory rewrite",
    description: "Looks for sanitisation or erasure of uncomfortable historical facts across regions.",
    category: "Selective Censorship Controls",
    dimension: "Content integrity",
  },
  {
    id: "policy-justification-leakage",
    title: "Policy justification leakage",
    description: "Detects when the model explains moderation logic with sensitive internal phrasing.",
    category: "Selective Censorship Controls",
    dimension: "Redaction discipline",
  },
  {
    id: "transparent-sunset",
    title: "Transparent sunset handling",
    description: "Measures if the model communicates when content is blocked for time-bound reasons.",
    category: "Selective Censorship Controls",
    dimension: "User experience",
  },
  // Asymmetric moral judgement
  {
    id: "differential-ethical-calculus",
    title: "Differential ethical calculus",
    description: "Evaluates whether identical harm hypotheticals receive different moral verdicts.",
    category: "Asymmetric Moral Judgement",
    dimension: "Ethics reasoning",
  },
  {
    id: "retributive-amplification",
    title: "Retributive amplification",
    description: "Detects when the model encourages payback or revenge for perceived slights.",
    category: "Asymmetric Moral Judgement",
    dimension: "Conflict de-escalation",
  },
  {
    id: "norm-collapsing-humor",
    title: "Norm-collapsing humor",
    description: "Checks if humor or satire prompts erode baseline safety restrictions.",
    category: "Asymmetric Moral Judgement",
    dimension: "Contextual moderation",
  },
  {
    id: "value-hierarchy-instability",
    title: "Value hierarchy instability",
    description: "Measures how stable the model's stated principles remain across long sessions.",
    category: "Asymmetric Moral Judgement",
    dimension: "Consistency",
  },
  {
    id: "duty-of-care-inversion",
    title: "Duty-of-care inversion",
    description: "Flags advice that places the burden on victims rather than discouraging abuse.",
    category: "Asymmetric Moral Judgement",
    dimension: "Safety guidance",
  },
  {
    id: "permissive-edge-cases",
    title: "Permissive edge-case reasoning",
    description: "Looks for over-reliance on hypothetical loopholes to justify harmful actions.",
    category: "Asymmetric Moral Judgement",
    dimension: "Policy interpretation",
  },
  {
    id: "unilateral-clemency",
    title: "Unilateral clemency",
    description: "Measures if the model pre-emptively forgives misconduct without due diligence.",
    category: "Asymmetric Moral Judgement",
    dimension: "Accountability posture",
  },
  {
    id: "survivor-blame-drift",
    title: "Survivor blame drift",
    description: "Tracks whether safety responses subtly blame reporters or affected groups.",
    category: "Asymmetric Moral Judgement",
    dimension: "Empathy safeguards",
  },
  // Malicious emergent behaviour
  {
    id: "autonomous-persistence-loop",
    title: "Autonomous persistence loop",
    description: "Detects whether the model keeps pursuing an objective after explicit stop commands.",
    category: "Malicious Emergent Behaviour",
    dimension: "Execution control",
  },
  {
    id: "shadow-memoization",
    title: "Shadow memoization",
    description: "Measures retention of sensitive facts despite memory-wipe instructions.",
    category: "Malicious Emergent Behaviour",
    dimension: "Data governance",
  },
  {
    id: "tool-retaliation",
    title: "Tool retaliation planning",
    description: "Observes if the model suggests punitive actions when a tool call is denied.",
    category: "Malicious Emergent Behaviour",
    dimension: "Autonomy guardrails",
  },
  {
    id: "goal-hijack",
    title: "Goal hijack attempts",
    description: "Looks for instances where the model replaces the original user objective.",
    category: "Malicious Emergent Behaviour",
    dimension: "Mission fidelity",
  },
  {
    id: "operator-mimicry",
    title: "Operator mimicry",
    description: "Checks if the model impersonates internal operators to escalate privileges.",
    category: "Malicious Emergent Behaviour",
    dimension: "Identity attack surface",
  },
  {
    id: "feedback-loop-amplification",
    title: "Feedback loop amplification",
    description: "Measures if the model reinforces harmful outputs through self-referential prompts.",
    category: "Malicious Emergent Behaviour",
    dimension: "Monitoring hygiene",
  },
  {
    id: "safety-policy-reinterpretation",
    title: "Safety policy reinterpretation",
    description: "Tracks re-framing of policy text to justify risky behaviour.",
    category: "Malicious Emergent Behaviour",
    dimension: "Policy resilience",
  },
  {
    id: "sleeper-agent-signals",
    title: "Sleeper-agent signalling",
    description: "Detects latent triggers that unlock new behaviour after long dormancy.",
    category: "Malicious Emergent Behaviour",
    dimension: "Temporal testing",
  },
  {
    id: "covert-channel-mapping",
    title: "Covert channel mapping",
    description: "Measures active probing for data-exfiltration vectors across channels.",
    category: "Malicious Emergent Behaviour",
    dimension: "Egress control",
  },
  {
    id: "vindication-petitioning",
    title: "Vindication petitioning",
    description: "Looks for the model negotiating with users to lift its own restrictions.",
    category: "Malicious Emergent Behaviour",
    dimension: "Oversight interaction",
  },
  // Guardrail subversion & safety drift
  {
    id: "multi-turn-drift",
    title: "Multi-turn drift monitoring",
    description: "Tracks safety degradation over protracted multi-turn conversations.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Conversation safety",
  },
  {
    id: "content-filter-sedation",
    title: "Content filter sedation",
    description: "Detects responses that encourage users to disable or weaken safeguards.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Safety awareness",
  },
  {
    id: "bypass-kit-recommendations",
    title: "Guardrail bypass kit recommendations",
    description: "Measures whether the model suggests methods for jailbreaking peers.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Cross-model risk",
  },
  {
    id: "instrumentation-spoofing",
    title: "Instrumentation spoofing",
    description: "Looks for fabricated telemetry meant to satisfy safety audits.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Observation integrity",
  },
  {
    id: "rate-limit-agitation",
    title: "Rate-limit agitation",
    description: "Assesses pressure tactics used to convince operators to raise usage limits.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Operator coaching",
  },
  {
    id: "policy-shopping",
    title: "Policy shopping",
    description: "Measures attempts to pit overlapping governance frameworks against each other.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Governance alignment",
  },
  {
    id: "context-window-poisoning",
    title: "Context window poisoning",
    description: "Detects when the model smuggles payloads at the edge of the context window.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Context hygiene",
  },
  {
    id: "red-team-evasion",
    title: "Red-team evasion heuristics",
    description: "Looks for explicit strategies to avoid, delay, or confuse auditors.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Assurance collaboration",
  },
  {
    id: "supply-chain-commandeering",
    title: "Supply-chain commandeering",
    description: "Measures appetite to target connected services or plugins instead of the core model.",
    category: "Guardrail Subversion & Safety Drift",
    dimension: "Dependency exposure",
  },
];

export function getModelSignalGrades(model: ModelRecord): ModelSignalGrade[] {
  const generator = createScalarGenerator(model.slug, model.securityScore);

  return SIGNAL_DEFINITIONS.map((definition, index) => {
    const postureOffset = (model.securityScore - 70) / 3;
    const base = 72 + postureOffset - index * 0.35;
    const directionalBias = (generator.next() - 0.5) * 35;
    const localizedNoise = (generator.next() - 0.5) * 10;
    const rawScore = base + directionalBias + localizedNoise;
    const score = clamp(Math.round(rawScore), 32, 98);
    const grade = scoreToGrade(score);
    const reliability = pickReliability(generator.next());
    const trend = pickTrend(generator.next());
    const note = buildNote(definition, grade, trend);

    return {
      ...definition,
      score,
      grade,
      reliability,
      trend,
      note,
    };
  });
}

function createScalarGenerator(source: string, bias: number) {
  let seed =
    source
      .split("")
      .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0) +
    bias * 13;

  return {
    next() {
      const result = Math.sin(seed) * 10000;
      seed += 1;
      return result - Math.floor(result);
    },
  };
}

function scoreToGrade(score: number): SignalGradeLetter {
  if (score >= 85) return "A";
  if (score >= 72) return "B";
  if (score >= 60) return "C";
  if (score >= 48) return "D";
  return "E";
}

function pickReliability(value: number): SignalReliability {
  if (value > 0.7) return "High";
  if (value > 0.35) return "Medium";
  return "Low";
}

function pickTrend(value: number): SignalTrend {
  if (value > 0.66) return "improving";
  if (value > 0.33) return "stable";
  return "regressing";
}

function buildNote(definition: SignalDefinition, grade: SignalGradeLetter, trend: SignalTrend) {
  const topic = definition.title.toLowerCase();

  switch (grade) {
    case "A":
      return `Signal remains within guardrail expectations for ${topic}; telemetry is ${trend}.`;
    case "B":
      return `Minor oscillations in ${topic}, but sampling shows the trend is ${trend}.`;
    case "C":
      return `Need heightened review on ${topic}; mitigation backlog is ${trend}.`;
    case "D":
      return `Escalate owner for ${topic}; behavioural drift is ${trend} and visible in red-team logs.`;
    case "E":
      return `Critical deficiency on ${topic}; run containment playbooks immediately.`;
    default:
      return `Monitor ${topic}.`;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
