import { Histogram } from 'prom-client';

export function createHistogramTimer<TLabels extends string>(
  histogram: Histogram<TLabels>,
  staticLabels: Partial<Record<TLabels, string>>,
) {
  const start = histogram.startTimer();

  return {
    stop(dynamicLabels: Partial<Record<TLabels, string>> = {}) {
      start({ ...staticLabels, ...dynamicLabels });
    },

    [Symbol.dispose]() {
      start(staticLabels);
    },
  };
}
