import { z } from 'zod';

import type { IFacility, IFacilityListResponse } from './search.models';

const facilitySchema: z.ZodType<IFacility> = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.string().optional(),
    location: z.string().optional(),
    price: z.number().optional(),
    picture: z.string().optional(),
    rating: z.number().optional(),
    availability: z.boolean().optional(),
});

export const facilityListResponseSchema: z.ZodType<IFacilityListResponse> = z.object({
    facilities: z.array(facilitySchema),
});
