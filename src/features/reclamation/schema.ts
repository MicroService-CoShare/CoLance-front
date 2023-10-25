import { z } from 'zod';

export type Reclamation = z.infer<ReturnType<typeof zReclamation>>;
export const zReclamation = () =>
  z.object({
    id: z.number(),
    titre: z.string(),
    description: z.string(),
    statut: z.enum(['OUVERT', 'FERME', 'EN_ATTENTE']), // Supposant que ce sont les seules valeurs valides
    priorite: z.enum(['HAUTE', 'MOYENNE', 'BASSE']), // Supposant que ce sont les seules valeurs valides
    notesInternes: z.string(),
    feedbackUtilisateur: z.string(),
    typeReclamation: z.enum(['TECHNIQUE', 'SERVICE_CLIENT', 'AUTRE']),
  });

export type ReclamationList = z.infer<ReturnType<typeof zReclamationList>>;
export const zReclamationList = () =>
  z.object({
    reclamation: z.array(zReclamation()),
    totalItems: z.string().transform(Number),
  });
