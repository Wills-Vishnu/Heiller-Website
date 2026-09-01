export const FLOW_DURATION_MS = 7_700;
export const FLOW_PHASE_MS = 1_100;

export type HeroFlowNode = {
  readonly id: string;
  readonly label: string;
  readonly color: `#${string}`;
  readonly activeText: `#${string}`;
  readonly x: number;
  readonly y: number;
  readonly delayMs: number;
};

export type HeroFlowSegment = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly path: string;
  readonly arrow: string;
  readonly delayMs: number;
};

export const heroFlowNodes = [
  { id: 'patient', label: 'Patient', color: '#FFAB8D', activeText: '#303433', x: 0, y: 0, delayMs: 0 },
  { id: 'verify', label: 'Verify', color: '#FC7EC7', activeText: '#303433', x: 137, y: 44, delayMs: 900 },
  { id: 'code', label: 'Code', color: '#B3A5F5', activeText: '#303433', x: 238, y: 131, delayMs: 2000 },
  { id: 'claim', label: 'Claim', color: '#B4E7BC', activeText: '#303433', x: 339, y: 218, delayMs: 3100 },
  { id: 'process', label: 'Process', color: '#96D7FF', activeText: '#303433', x: 653, y: 218, delayMs: 4200 },
  { id: 'payment', label: 'Payment', color: '#FAE261', activeText: '#303433', x: 747, y: 131, delayMs: 5300 },
  { id: 'report', label: 'Report', color: '#97B6FF', activeText: '#303433', x: 841, y: 44, delayMs: 6400 },
  { id: 'optimize', label: 'Optimize', color: '#4A2A76', activeText: '#FFFFFF', x: 978, y: 0, delayMs: 7400 },
] as const satisfies readonly HeroFlowNode[];

export const heroFlowSegments = [
  { id: 'patient-verify', from: 'patient', to: 'verify', path: 'M50.5 65 L50.5 68.75 Q50.5 72.5 54.25 72.5 L121 72.5', arrow: 'M121 65.5 L129 72.5 L121 79.5', delayMs: 0 },
  { id: 'verify-code', from: 'verify', to: 'code', path: 'M187.5 109 L187.5 142.25 Q187.5 159.5 204.75 159.5 L222 159.5', arrow: 'M222 152.5 L230 159.5 L222 166.5', delayMs: 1100 },
  { id: 'code-claim', from: 'code', to: 'claim', path: 'M288.5 196 L288.5 229.25 Q288.5 246.5 305.75 246.5 L323 246.5', arrow: 'M323 239.5 L331 246.5 L323 253.5', delayMs: 2200 },
  { id: 'claim-process', from: 'claim', to: 'process', path: 'M448 246.5 L637 246.5', arrow: 'M637 239.5 L645 246.5 L637 253.5', delayMs: 3300 },
  { id: 'process-payment', from: 'process', to: 'payment', path: 'M703.5 210 L703.5 173.25 Q703.5 159.5 717.25 159.5 L731 159.5', arrow: 'M731 152.5 L739 159.5 L731 166.5', delayMs: 4400 },
  { id: 'payment-report', from: 'payment', to: 'report', path: 'M797.5 123 L797.5 86.25 Q797.5 72.5 811.25 72.5 L825 72.5', arrow: 'M825 65.5 L833 72.5 L825 79.5', delayMs: 5500 },
  { id: 'report-optimize', from: 'report', to: 'optimize', path: 'M891.5 36 L891.5 32.25 Q891.5 28.5 895.25 28.5 L962 28.5', arrow: 'M962 21.5 L970 28.5 L962 35.5', delayMs: 6600 },
] as const satisfies readonly HeroFlowSegment[];

export const heroFlowNodeById = Object.fromEntries(heroFlowNodes.map((node) => [node.id, node])) as Record<string, HeroFlowNode>;
