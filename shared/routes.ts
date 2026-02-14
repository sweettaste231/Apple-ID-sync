
import { z } from 'zod';
import { insertCredentialSchema } from './schema';

export const api = {
  credentials: {
    create: {
      method: 'POST' as const,
      path: '/api/credentials' as const,
      input: insertCredentialSchema,
      responses: {
        200: z.object({ success: z.boolean() }),
        400: z.object({ message: z.string() }),
      },
    },
  },
};
