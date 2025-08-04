import { z } from 'zod';

export abstract class AbstractConfigService<T extends Record<string, unknown>> {
  protected readonly config: T;

  public readonly get: { [K in keyof T]: T[K] };

  constructor(schema: z.ZodType<T>, raw: unknown) {
    this.config = schema.parse(raw);
    this.get = this.config;
  }
}
