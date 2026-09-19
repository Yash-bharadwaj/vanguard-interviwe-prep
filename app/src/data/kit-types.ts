export interface Kit {
  n: number;
  s30: string;        // 30-second spoken answer
  s120: string;       // 2-minute spoken answer
  simple: string;     // plain-English version
  mine: string;       // what I really did / ownership
  danger: string;     // weak/dangerous answer to avoid
  dk: string;         // honest "if I don't know"
  key: string[];      // key points used by mock-interview grader
  follows: { q: string; a: string }[];
  verify?: string;
}
