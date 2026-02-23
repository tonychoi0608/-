import { z } from 'zod';
import { insertFeedbackSchema, feedbacks } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  feedbacks: {
    list: {
      method: 'GET' as const,
      path: '/api/feedbacks' as const,
      responses: {
        200: z.array(z.custom<typeof feedbacks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/feedbacks' as const,
      input: insertFeedbackSchema,
      responses: {
        201: z.custom<typeof feedbacks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type FeedbackInput = z.infer<typeof api.feedbacks.create.input>;
export type FeedbackResponse = z.infer<typeof api.feedbacks.create.responses[201]>;
export type FeedbacksListResponse = z.infer<typeof api.feedbacks.list.responses[200]>;
