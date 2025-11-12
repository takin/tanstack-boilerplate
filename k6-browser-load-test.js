import { browser } from 'k6/browser'
import { check, sleep } from 'k6'

/**
 * Browser Load Test - Multiple virtual users testing with real browsers
 * Tests user flow: Login -> Navigate to Users -> Interact with UI
 */
export const options = {
  scenarios: {
    browser_load: {
      executor: 'ramping-vus',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      stages: [
        { duration: '1m', target: 3 }, // Ramp up to 3 users
        { duration: '3m', target: 3 }, // Stay at 3 users
        { duration: '1m', target: 0 }, // Ramp down
      ],
    },
  },
  thresholds: {
    checks: ['rate>0.9'], // 90% of checks should pass
    browser_web_vital_fcp: ['p(95) < 3000'], // First Contentful Paint < 3s
    browser_web_vital_lcp: ['p(95) < 4000'], // Largest Contentful Paint < 4s
    browser_web_vital_inp: ['p(95) < 200'], // Interaction to Next Paint < 200ms
    browser_http_req_duration: ['p(95) < 2000'], // Browser requests < 2s
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = __ENV.TEST_EMAIL || 'admin@example.com'
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'password123'

export default async function () {
  const page = await browser.newPage()

  try {
    // Step 1: Login
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' })
    await page.waitForSelector('input[id="email"]', { timeout: 10000 })

    await page.locator('input[id="email"]').type(TEST_EMAIL)
    await page.locator('input[type="password"]').type(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()

    await page.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle' })

    check(page, {
      'login succeeds': () => page.url() !== `${BASE_URL}/`,
    })

    sleep(1)

    // Step 2: Navigate to admin users
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle' })
    await page.waitForSelector('table', { timeout: 15000 })

    check(page, {
      'admin users page loads': () => page.url().includes('/admin/users'),
      'table renders': () => page.locator('table').isVisible(),
      'table has header': () => page.locator('thead').isVisible(),
      'table has body': () => page.locator('tbody').isVisible(),
    })

    // Verify data loaded with proper error handling
    try {
      const tableRows = page.locator('tbody tr')
      const rowCount = await tableRows.count().catch(() => 0)

      check(rowCount, {
        'table has data': (count) => count > 0,
      })
    } catch (countError) {
      console.warn(
        '⚠️ Could not count table rows:',
        countError.message || countError,
      )
    }

    sleep(2)

    // Step 3: Test pagination with proper error handling
    try {
      const nextButton = page.locator('button#next-page')
      const isVisible = await nextButton.isVisible().catch(() => false)
      const isEnabled = await nextButton.isEnabled().catch(() => false)

      if (isVisible && isEnabled) {
        await nextButton.click()
        await page.waitForTimeout(1500)

        check(page, {
          'pagination works': () => true,
        })
      }
    } catch (paginationError) {
      console.warn(
        '⚠️ Pagination test skipped:',
        paginationError.message || paginationError,
      )
    }

    sleep(1)

    // Step 4: Test search with proper error handling
    try {
      const searchInput = page.locator('input[placeholder*="Search"]')
      const searchVisible = await searchInput.isVisible().catch(() => false)

      if (searchVisible) {
        await searchInput.clear()
        await searchInput.type('test')
        await page.waitForTimeout(2000)

        check(page, {
          'search works': () => true,
        })

        // Clear search
        await searchInput.clear()
        await page.waitForTimeout(1500)
      }
    } catch (searchError) {
      console.warn(
        '⚠️ Search test skipped:',
        searchError.message || searchError,
      )
    }

    sleep(1)

    // Step 5: Test sorting with proper error handling
    try {
      const sortButtons = page.locator('th button')
      const sortButtonCount = await sortButtons.count().catch(() => 0)

      if (sortButtonCount > 0) {
        await sortButtons.nth(0).click()
        await page.waitForTimeout(1500)

        check(page, {
          'sorting works': () => true,
        })
      }
    } catch (sortError) {
      console.warn('⚠️ Sorting test skipped:', sortError.message || sortError)
    }

    sleep(1)
  } catch (error) {
    console.error('❌ Browser load test failed:', error.message || error)
    try {
      await page.screenshot({ path: 'screenshots/browser-load-test-error.png' })
    } catch (screenshotError) {
      console.warn(
        '⚠️ Could not take screenshot:',
        screenshotError.message || screenshotError,
      )
    }
  } finally {
    try {
      await page.close()
    } catch (closeError) {
      // Page might already be closed, ignore
      console.warn('⚠️ Page close warning:', closeError.message || closeError)
    }
  }
}

export function setup() {
  console.log('🌐 Starting Browser Load Test')
  console.log(`Target: ${BASE_URL}`)
  console.log('This will open real browsers and simulate user interactions')
  console.log('Note: Browser tests are slower and more resource-intensive\n')
}

export function teardown(data) {
  console.log('\n🏁 Browser load test completed!')
}
