import { z } from 'zod';

export type Reclamation = z.infer<ReturnType<typeof zReclamation>>;
export const zReclamation = () =>
  z.object({
    id: z.number(),
    name: z.string(),
    link: z.string(),
    description: z.string().nullish(),
  });

export type ReclamationList = z.infer<ReturnType<typeof zReclamationList>>;
export const zReclamationList = () =>
  z.object({
    reclamation: z.array(zReclamation()),
    totalItems: z.string().transform(Number),
  });
