export type Project = {
  name: string;
  size: 'S' | 'M' | 'L';
  language: string;
  link: string;
};

export type Owner =
  | null
  | {
      type: 'L' | 'M_h' | 'M_v' | 'S';
      index: number;
      start: { r: number; c: number };
    };

export type Placement = {
  index: number;
  r: number;
  c: number;
  w: number;
  h: number;
};
