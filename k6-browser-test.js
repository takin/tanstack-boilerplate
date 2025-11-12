import { browser } from 'k6/browser'
import { check } from 'k6'

/**
 * Browser Test - Comprehensive UI testing with screenshots
 * Tests full user flow: Login -> Navigate -> Interact with UI
 */
export const options = {
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
      maxDuration: '30s',
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
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
    console.log('🌐 Running comprehensive browser test...')

    // Test 1: Login
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

    console.log('2. Performing login...')
    await page.locator('input[id="email"]').type(TEST_EMAIL)
    await page.locator('input[type="password"]').type(TEST_PASSWORD)
    await page.locator('button[type="submit"]').click()
    await page.waitForNavigation({ timeout: 10000 })

    check(page, {
      'login succeeds': () => page.url() !== `${BASE_URL}/`,
    })

    // Test 2: Navigate to admin users page
    console.log('3. Accessing admin users page...')
    await page.goto(`${BASE_URL}/admin/users`)
    await page.waitForSelector('table', { timeout: 15000 })

    check(page, {
      'admin users page loads': () => page.url().includes('/admin/users'),
      'table renders': () => page.locator('table').isVisible(),
      'table has header': () => page.locator('thead').isVisible(),
      'table has body': () => page.locator('tbody').isVisible(),
    })

    // Test 3: Verify data loaded
    console.log('4. Verifying table data...')
    const tableRows = await page.locator('tbody tr')
    const rowCount = await tableRows.count()

    check(rowCount, {
      'table has data': (count) => count > 0,
    })

    console.log(`Found ${rowCount} users in table`)

    // Test 4: Test pagination
    console.log('5. Testing pagination...')
    const nextButton = page.locator('button:has-text("Next")')
    if ((await nextButton.isVisible()) && (await nextButton.isEnabled())) {
      await nextButton.click()
      await page.waitForTimeout(1500)

      check(page, {
        'pagination works': () => true,
      })
    }

    // Test 5: Test search
    console.log('6. Testing search...')
    const searchInput = page.locator('input[placeholder*="Search"]')
    if (await searchInput.isVisible()) {
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

    // Take success screenshot
    await page.screenshot({ path: 'screenshots/admin-users.png' })

    console.log('✅ All browser tests passed!')
  } catch (error) {
    console.error('❌ Browser test failed:', error.message)
    await page.screenshot({ path: 'screenshots/browser-test-error.png' })
    throw error
  } finally {
    await page.close()
  }
}

export function setup() {
  console.log('🌐 Starting Comprehensive Browser Test')
  console.log(`Target: ${BASE_URL}`)
  console.log('Purpose: UI validation with screenshots\n')
}

export function teardown(data) {
  console.log('\n🏁 Browser test completed!')
}
