export type Variant = 'line' | 'duotone';

export interface Icon {
  name: string;
  variants: { line: string; duotone?: string };
}

export interface RenderOptions {
  variant?: Variant;
  size?: number | string;
  title?: string;
  className?: string;
}

export const ROOT_ATTRS: Record<string, string>;
export function renderSvg(icon: Icon, options?: RenderOptions): string;
