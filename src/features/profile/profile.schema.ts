import { z } from 'zod';

import type { IProfile, IProfileResponse, IProfileUpdate } from './profile.models';

const profileSchema: z.ZodType<IProfile> = z.object({
    id: z.string(),
    phone: z.string(),
    nickName: z.string().optional(),
    avatar: z.string().optional(),
});

export const profileResponseSchema: z.ZodType<IProfileResponse> = z.object({
    user: profileSchema,
});

export const profileUpdateInputSchema: z.ZodType<IProfileUpdate> = z.object({
    nickName: z.string().trim().max(64).optional(),
});
