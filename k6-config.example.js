/**
 * K6 Browser Testing Configuration Examples
 *
 * Copy and modify these configurations based on your needs.
 * Use them by setting `export const options = <config>;` in your test file.
 */

/**
 * Browser Smoke Test Configuration
 * Quick test with single browser
 */
export const browserSmokeTestConfig = {
  scenarios: {
    ui_smoke: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
          headless: true,
        },
      },
      vus: 1,
      iterations: 1,
      maxDuration: '1m',
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
    browser_web_vital_fcp: ['p(95) < 3000'],
    browser_web_vital_lcp: ['p(95) < 4000'],
  },
}

/**
 * Browser Load Test Configuration
 * Multiple browsers with ramping load
 */
export const browserLoadTestConfig = {
  scenarios: {
    browser_load: {
      executor: 'ramping-vus',
      options: {
        browser: {
          type: 'chromium',
          headless: true,
        },
      },
      stages: [
        { duration: '1m', target: 3 },
        { duration: '3m', target: 3 },
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    checks: ['rate>0.9'],
    browser_web_vital_fcp: ['p(95) < 3000'],
    browser_web_vital_lcp: ['p(95) < 4000'],
    browser_web_vital_inp: ['p(95) < 200'],
  },
}

/**
 * Browser Stress Test Configuration
 * Find breaking point with browsers
 */
export const browserStressTestConfig = {
  scenarios: {
    browser_stress: {
      executor: 'ramping-vus',
      options: {
        browser: {
          type: 'chromium',
          headless: true,
        },
      },
      stages: [
        { duration: '2m', target: 3 },
        { duration: '3m', target: 3 },
        { duration: '2m', target: 5 },
        { duration: '3m', target: 5 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    checks: ['rate>0.8'],
    browser_web_vital_fcp: ['p(95) < 5000'],
    browser_web_vital_lcp: ['p(95) < 6000'],
  },
}

/**
 * Browser Soak Test Configuration
 * Extended duration for stability
 */
export const browserSoakTestConfig = {
  scenarios: {
    browser_soak: {
      executor: 'constant-vus',
      options: {
        browser: {
          type: 'chromium',
          headless: true,
        },
      },
      vus: 2,
      duration: '30m',
    },
  },
  thresholds: {
    checks: ['rate>0.95'],
    browser_web_vital_fcp: ['p(95) < 3000'],
    browser_web_vital_lcp: ['p(95) < 4000'],
    browser_http_req_failed: ['rate<0.05'],
  },
}

/**
 * Browser Test with Headless Disabled
 * For debugging - see browser in action
 */
export const browserDebugConfig = {
  scenarios: {
    ui_debug: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
          headless: false, // Show browser window
          slowMo: '500ms', // Slow down for debugging
        },
      },
      vus: 1,
      iterations: 1,
      maxDuration: '5m',
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
}

/**
 * Custom Web Vitals Thresholds
 */
export const customWebVitalsThresholds = {
  // Response time thresholds
  browser_web_vital_fcp: [
    'p(50)<1500', // 50% of requests under 1.5s
    'p(90)<2000', // 90% of requests under 2s
    'p(95)<3000', // 95% of requests under 3s
    'p(99)<5000', // 99% of requests under 5s
  ],

  browser_web_vital_lcp: [
    'p(50)<2000', // 50% under 2s
    'p(90)<2500', // 90% under 2.5s
    'p(95)<4000', // 95% under 4s
  ],

  browser_web_vital_cls: [
    'p(95)<0.1', // 95% should have CLS < 0.1
  ],

  browser_web_vital_fid: [
    'p(95)<100', // 95% should have FID < 100ms
  ],

  browser_web_vital_inp: [
    'p(95)<200', // 95% should have INP < 200ms
  ],

  // Error rate threshold
  browser_http_req_failed: ['rate<0.05'], // Less than 5% errors

  // Check success rate
  checks: ['rate>0.95'], // 95% of checks should pass
}

/**
 * Scenario-based Browser Configuration
 * Multiple scenarios running simultaneously
 */
export const scenarioBasedBrowserConfig = {
  scenarios: {
    // Constant load
    constantLoad: {
      executor: 'constant-vus',
      options: {
        browser: {
          type: 'chromium',
          headless: true,
        },
      },
      vus: 2,
      duration: '10m',
      tags: { scenario: 'constant' },
    },

    // Ramping load
    rampingLoad: {
      executor: 'ramping-vus',
      options: {
        browser: {
          type: 'chromium',
          headless: true,
        },
      },
      startVUs: 0,
      stages: [
        { duration: '5m', target: 3 },
        { duration: '10m', target: 3 },
        { duration: '5m', target: 0 },
      ],
      tags: { scenario: 'ramping' },
    },
  },
  thresholds: {
    'browser_web_vital_fcp{scenario:constant}': ['p(95)<2000'],
    'browser_web_vital_fcp{scenario:ramping}': ['p(95)<3000'],
  },
}

/**
 * Cloud Test Configuration
 * For running tests on k6 Cloud
 */
export const cloudBrowserTestConfig = {
  ext: {
    loadimpact: {
      projectID: 'YOUR_PROJECT_ID',
      name: 'Admin Users Browser Test',
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 50 },
        'amazon:ie:dublin': { loadZone: 'amazon:ie:dublin', percent: 50 },
      },
    },
  },
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      vus: 1,
      iterations: 1,
    },
  },
  thresholds: {
    browser_web_vital_fcp: ['p(95)<3000'],
    browser_web_vital_lcp: ['p(95)<4000'],
    browser_http_req_failed: ['rate<0.05'],
  },
}
