
export interface Bird {
  y: number;
  velocity: number;
  width: number;
  height: number;
}

export interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
}

export interface Collectible {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "coin" | "scam";
  collected: boolean;
}
