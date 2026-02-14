import { useMutation } from "@tanstack/react-query";
import { api, type InsertCredential } from "@shared/routes";

// POST /api/credentials
export function useCreateCredential() {
  return useMutation({
    mutationFn: async (data: InsertCredential) => {
      // Validate with Zod schema from routes
      const validated = api.credentials.create.input.parse(data);
      
      const res = await fetch(api.credentials.create.path, {
        method: api.credentials.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || 'Validation failed');
        }
        throw new Error('Failed to submit credentials');
      }

      // Parse response
      return api.credentials.create.responses[200].parse(await res.json());
    },
  });
}
