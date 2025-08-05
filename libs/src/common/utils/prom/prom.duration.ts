import { Histogram } from 'prom-client';

import { createHistogramTimer } from './prom.histogram.timer';

export async function measureDuration<T, TLabels extends string>(
  histogram: Histogram<TLabels>,
  staticLabels: Partial<Record<TLabels, string>>,
  fn: () => Promise<T> | T,
): Promise<T> {
  const timer = createHistogramTimer(histogram, staticLabels);

  try {
    const result = await fn();
    timer.stop({ status: 'success' } as Partial<Record<TLabels, string>>);
    return result;
  } catch (err) {
    timer.stop({ status: 'error' } as Partial<Record<TLabels, string>>);
    throw err;
  }
}
