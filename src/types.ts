export interface Hestia {
  key: string;
  label: string;
  sub: string;
  description: string;
  explanation: string;
  capital?: string;
  capitalCoords?: [number, number];
}

export interface Standing {
  label: string;
  className: string;
  color: string;
}

export type StandingKey = 'member' | 'inner-assoc' | 'outer-assoc' | 'strategic' | 'non-eu';

export interface CountryData {
  name: string;
  standing: StandingKey;
  note: string;
  hestias: Record<string, number>;
  reasons?: Record<string, string>;
  aspirant?: 'member' | 'iua';
}

export interface NonFrameworkEntry {
  note?: string;
  suspended?: boolean;
}

export interface IsoMappings {
  numericToAlpha3: Record<number, string>;
  nameToAlpha3: Record<string, string>;
}

export interface MapCountry {
  id: string | number;
  alpha3: string | null;
  data: CountryData | null;
  pathData: string;
  featureName: string;
  isFramework: boolean;
  isSelected: boolean;
  isHestiaActive: boolean;
  isSuspended: boolean;
  fill: string;
  opacity: string | undefined;
}
