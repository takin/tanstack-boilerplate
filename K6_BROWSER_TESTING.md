# 🌐 K6 Browser Testing Guide

Dokumentasi lengkap untuk menjalankan browser testing menggunakan K6. Browser testing mensimulasikan user sebenarnya menggunakan browser untuk berinteraksi dengan aplikasi.

## 📖 Apa itu K6 Browser Testing?

K6 Browser Testing memungkinkan Anda untuk:
- ✅ Mensimulasikan user sebenarnya dengan browser Chromium
- ✅ Mengukur Web Vitals (FCP, LCP, CLS, dll)
- ✅ Test user flows end-to-end (login, navigation, interactions)
- ✅ Capture screenshots untuk debugging
- ✅ Validate UI elements dan behavior

Referensi: [K6 Browser Documentation](https://grafana.com/docs/k6/latest/using-k6-browser/)

## 🔧 Prerequisites

### 1. Install K6 dengan Browser Support

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### 2. Install Chromium Browser

**macOS:**
```bash
brew install chromium
```

**Linux:**
```bash
sudo apt-get install chromium-browser
```

**Atau gunakan Google Chrome** yang sudah terinstall di sistem Anda.

### 3. Setup Screenshots Directory

```bash
mkdir -p screenshots
```

## 🚀 Running Browser Tests

### 1. 🔥 Browser Smoke Test (1 menit)

Quick verification dengan browser sebenarnya:

```bash
pnpm k6:browser:smoke
```

**Yang ditest:**
- Login page loads correctly
- Can login with credentials
- Can access admin users page
- Table renders with data
- Basic UI elements present

---

### 2. 🌐 Browser Basic Test (30 detik)

Comprehensive single-user test dengan screenshots:

```bash
pnpm k6:browser
```

**Yang ditest:**
- Full login flow
- Navigate to admin users
- Test pagination
- Test search functionality
- Capture screenshots
- Validate UI interactions

---

### 3. 📊 Browser Load Test (5 menit)

Multiple users testing dengan real browsers:

```bash
pnpm k6:browser:load
```

**Detail:**
- Virtual Users: 1 → 3 users
- Duration: ~5 minutes
- Real browser instances
- Full user interactions
- Web Vitals metrics

⚠️ **Note:** Browser tests are resource-intensive. Each VU opens a real browser.

---

## 📊 Browser-Specific Metrics

Browser testing provides additional metrics yang tidak tersedia di HTTP-only testing:

### Web Vitals Metrics

| Metric | Description | Good | Needs Improvement |
|--------|-------------|------|-------------------|
| **FCP** (First Contentful Paint) | Waktu hingga konten pertama muncul | < 1.8s | > 3s |
| **LCP** (Largest Contentful Paint) | Waktu hingga konten terbesar muncul | < 2.5s | > 4s |
| **CLS** (Cumulative Layout Shift) | Stabilitas visual layout | < 0.1 | > 0.25 |
| **FID** (First Input Delay) | Responsiveness terhadap input pertama | < 100ms | > 300ms |
| **INP** (Interaction to Next Paint) | Responsiveness keseluruhan | < 200ms | > 500ms |
| **TTFB** (Time to First Byte) | Waktu server response | < 600ms | > 1.8s |

### Browser HTTP Metrics

- `browser_data_received`: Total data received
- `browser_data_sent`: Total data sent
- `browser_http_req_duration`: Browser request duration
- `browser_http_req_failed`: Failed browser requests

## 📝 Test Scripts

### k6-browser-smoke-test.js

```javascript
// Quick verification test
// - 1 VU, 1 iteration
// - All checks must pass
// - Max duration: 1 minute
```

**Use case:** CI/CD, quick checks sebelum deploy

### k6-browser-test.js

```javascript
// Comprehensive single-user test
// - Tests login, navigation, interactions
// - Captures screenshots
// - Validates all UI elements
```

**Use case:** Development testing, UI validation

### k6-browser-load-test.js

```javascript
// Multi-user browser load test
// - Ramps up to 3 concurrent users
// - Each user runs full flow
// - Duration: 5 minutes
```

**Use case:** Performance testing dengan real users

## 🎯 Why Browser Testing?

Browser testing dengan K6 memberikan:

- ✅ **Real User Simulation** - Actual browser behavior, bukan hanya HTTP requests
- ✅ **Web Vitals Metrics** - Measure real user experience (FCP, LCP, CLS, etc)
- ✅ **UI Validation** - Test actual UI elements dan interactions
- ✅ **Screenshot Capture** - Visual debugging dan documentation
- ✅ **E2E Testing** - Complete user journeys dari login sampai interaction
- ✅ **JavaScript Rendering** - Test actual frontend rendering dan behavior

## 💡 Best Practices

### 1. Resource Management

Browser tests consume significant resources:

```bash
# Good: 1-5 concurrent browser users
vus: 3

# Bad: Too many browsers
vus: 50  # ❌ Will overwhelm system
```

### 2. Wait for Elements

Always wait for elements before interaction:

```javascript
// Good
await page.waitForSelector('table', { timeout: 10000 })
await page.locator('button').click()

// Bad
await page.locator('button').click() // ❌ Might fail if not loaded
```

### 3. Use Appropriate Timeouts

```javascript
// Navigation timeout
await page.waitForNavigation({ timeout: 10000 })

// Element timeout
await page.waitForSelector('table', { timeout: 15000 })

// Custom wait
await page.waitForTimeout(2000)
```

### 4. Error Handling

```javascript
try {
  await page.goto(url)
  // ... test steps
} catch (error) {
  console.error('Test failed:', error)
  await page.screenshot({ path: 'error.png' })
  throw error
} finally {
  await page.close()
}
```

### 5. Screenshots for Debugging

```javascript
// Success screenshot
await page.screenshot({ path: 'screenshots/success.png' })

// Error screenshot
await page.screenshot({ path: 'screenshots/error.png' })
```

## 🔍 Example Output

```bash
     execution: local
        script: k6-browser-smoke-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 1 max VUs, 1m30s max duration
              * ui_smoke: 1 iterations shared among 1 VUs (maxDuration: 1m0s)

     ✓ login page loads
     ✓ email input exists
     ✓ password input exists
     ✓ submit button exists
     ✓ login succeeds
     ✓ admin users page loads
     ✓ table renders
     ✓ table has header
     ✓ table has body
     ✓ table has data

     checks.........................: 100.00% ✓ 10      ✗ 0

     BROWSER
     browser_data_received..........: 425 kB  68 kB/s
     browser_data_sent..............: 5.2 kB  832 B/s
     browser_http_req_duration......: avg=287ms min=98ms  med=245ms max=892ms
     browser_http_req_failed........: 0.00%   ✓ 0       ✗ 22

     WEB_VITALS
     browser_web_vital_cls..........: avg=0     min=0     med=0     max=0
     browser_web_vital_fcp..........: avg=1.82s min=1.82s med=1.82s max=1.82s
     browser_web_vital_fid..........: avg=245µs min=245µs med=245µs max=245µs
     browser_web_vital_inp..........: avg=48ms  min=48ms  med=48ms  max=48ms
     browser_web_vital_lcp..........: avg=2.14s min=2.14s med=2.14s max=2.14s
     browser_web_vital_ttfb.........: avg=892ms min=892ms med=892ms max=892ms
```

## 🔧 Configuration

### Environment Variables

```bash
# Base URL
export BASE_URL=http://localhost:3000

# Test credentials
export TEST_EMAIL=admin@example.com
export TEST_PASSWORD=password123
```

### Custom Browser Options

```javascript
export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
          headless: true,  // Run without GUI
          slowMo: '500ms', // Slow down for debugging
        },
      },
    },
  },
}
```

## 🐛 Troubleshooting

### Error: "Browser not found"

```bash
# Install Chromium
brew install chromium  # macOS
sudo apt-get install chromium-browser  # Linux
```

### Error: "Timeout waiting for element"

Increase timeout atau verify selector:

```javascript
// Increase timeout
await page.waitForSelector('table', { timeout: 20000 })

// Check if element exists
const exists = await page.locator('table').isVisible()
```

### Error: "Too many open files"

Reduce concurrent VUs:

```javascript
// Before
vus: 10  // ❌ Too many browsers

// After
vus: 3   // ✅ Reasonable number
```

### High Memory Usage

Browser tests use significant memory:

```bash
# Monitor system resources
./monitor-system.sh 5
```

Recommendations:
- Limit concurrent VUs to 3-5
- Close pages properly with `page.close()`
- Use headless mode: `headless: true`

## 📚 Advanced Topics

### 1. Custom Metrics

```javascript
import { Trend } from 'k6/metrics'

const customMetric = new Trend('custom_page_load')

export default async function () {
  const start = Date.now()
  await page.goto(url)
  await page.waitForSelector('table')
  const duration = Date.now() - start
  
  customMetric.add(duration)
}
```

### 2. Multiple Pages

```javascript
export default async function () {
  const page1 = await browser.newPage()
  const page2 = await browser.newPage()
  
  try {
    await page1.goto(url1)
    await page2.goto(url2)
    // ... tests
  } finally {
    await page1.close()
    await page2.close()
  }
}
```

### 3. File Upload

```javascript
await page.locator('input[type="file"]').setInputFiles('path/to/file.pdf')
```

### 4. Handle Dialogs

```javascript
page.on('dialog', async dialog => {
  console.log(`Dialog: ${dialog.message()}`)
  await dialog.accept()
})
```

## 🎓 Learning Resources

- [K6 Browser Documentation](https://grafana.com/docs/k6/latest/using-k6-browser/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [K6 Browser Examples](https://grafana.com/docs/k6/latest/examples/browser/)

## 📊 When to Use Browser Testing?

Browser testing ideal untuk:
- ✅ Testing UI/UX performance
- ✅ Validating user workflows
- ✅ Measuring Web Vitals
- ✅ Testing frontend rendering
- ✅ E2E acceptance testing
- ✅ Need screenshots for debugging
- ✅ Real user experience validation
- ✅ Visual regression testing

## 🏁 Summary

Browser testing dengan K6 memberikan:
- ✅ Real user simulation dengan Chromium
- ✅ Web Vitals metrics (FCP, LCP, CLS, FID, INP, TTFB)
- ✅ UI validation dan interaction testing
- ✅ Screenshot capabilities untuk debugging
- ✅ Full E2E testing dari login sampai user interactions
- ✅ Complete user journey validation

Perfect untuk testing user experience dan UI performance! 🎉

---

**Happy Browser Testing!** 🎉

