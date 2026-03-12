// Zod 校验 Schema，供 API Route Handler 用于入参验证
// 同时可在前端表单中复用（type-safe form validation）
import { z } from "zod";

export const createQrCodeSchema = z.object({
  targetUrl: z.string().url("请输入有效的 URL"),
  title: z.string().min(1, "请输入名称").max(100),
  shortCode: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/, "短码只能包含字母、数字、- 和 _")
    .min(3)
    .max(32)
    .optional(),
});

export const updateQrCodeSchema = z.object({
  targetUrl: z.string().url("请输入有效的 URL").optional(),
  title: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

export type CreateQrCodeInput = z.infer<typeof createQrCodeSchema>;
export type UpdateQrCodeInput = z.infer<typeof updateQrCodeSchema>;
