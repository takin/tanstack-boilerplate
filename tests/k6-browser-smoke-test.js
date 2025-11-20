import { browser } from 'k6/browser'
import { check } from 'k6'

/**
 * Browser Smoke Test - Quick verification with real browser
 * Validates that basic user flow works end-to-end
 */
export const options = {
  scenarios: {
    ui_smoke: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      vus: 1,
      iterations: 1,
      maxDuration: '1m',
    },
  },
  thresholds: {
    checks: ['rate==1.0'], // All checks must pass
    browser_web_vital_fcp: ['p(95) < 3000'],
    browser_web_vital_lcp: ['p(95) < 4000'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = __ENV.TEST_EMAIL || 'admin@example.com'
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'password123'

export default async function () {
  const page = await browser.newPage()

  try {
    console.log('🔥 Running browser smoke test...')

    // Test 1: Can reach login page
    console.log('1. Loading login page...')
    await page.goto(`${BASE_URL}/`)
    await page.waitForSelector('input[id="email"]', { timeout: 10000 })

    check(page, {
      'login page loads': () => page.url() === `${BASE_URL}/`,
      'email input exists': () => page.locator('input[id="email"]').isVisible(),
      'password input exists': () =>
        page.locator('input[type="password"]').isVisible(),
      'submit button exists': () =>
        page.locator('button[type="submit"]').isVisible(),
    })

    // Test 2: Can login
    console.log('2. Performing login...')
    await page.locator('input[id="email"]').type(TEST_EMAIL)
    await page.locator('input[type="password"]').type(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()
    await page.waitForNavigation({ timeout: 10000 })

    check(page, {
      'login succeeds': () => page.url() !== `${BASE_URL}/`,
    })

    // Test 3: Can access admin users page
    console.log('3. Accessing admin users page...')
    await page.goto(`${BASE_URL}/admin/users`)
    await page.waitForSelector('table', { timeout: 15000 })

    check(page, {
      'admin users page loads': () => page.url().includes('/admin/users'),
      'table renders': () => page.locator('table').isVisible(),
      'table has header': () => page.locator('thead').isVisible(),
      'table has body': () => page.locator('tbody').isVisible(),
    })

    // Test 4: Verify basic UI elements
    console.log('4. Verifying UI elements...')
    const hasRows = (await page.locator('tbody tr').count()) > 0

    check(hasRows, {
      'table has data': (value) => value === true,
    })

    console.log('✅ All smoke tests passed!')
  } catch (error) {
    console.error('❌ Smoke test failed:', error.message)
    await page.screenshot({ path: 'screenshots/smoke-test-error.png' })
    throw error
  } finally {
    await page.close()
  }
}

export function setup() {
  console.log('🔥 Starting Browser Smoke Test')
  console.log(`Target: ${BASE_URL}`)
  console.log('Purpose: Quick verification with real browser\n')
}

export function teardown(data) {
  console.log('\n🏁 Browser smoke test completed!')
}
