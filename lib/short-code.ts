import { customAlphabet } from "nanoid";

// URL 安全字符集，6 位 ≈ 560 亿种组合
const generate = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  8
);

export function generateShortCode(): string {
  return generate();
}

/** 校验短码格式：3-32 位字母数字及 -_ */
export function isValidShortCode(code: string): boolean {
  return /^[a-zA-Z0-9_-]{3,32}$/.test(code);
}
