# 🚀 Quick Start: K6 Browser Testing

Panduan singkat untuk memulai browser testing halaman `/admin/users` menggunakan K6 Browser.

## Instalasi

### 1. Install K6

**MacOS:**

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

**Windows (Chocolatey):**

```bash
choco install k6
```

### 2. Install Chromium

**MacOS:**

```bash
brew install chromium
```

**Linux:**

```bash
sudo apt-get install chromium-browser
```

**Atau gunakan Google Chrome** yang sudah terinstall.

## Setup

1. **Pastikan aplikasi running:**

   ```bash
   pnpm dev
   ```

2. **Pastikan test user exists:**

   Anda bisa seed users dengan:

   ```bash
   pnpm seed:users
   ```

   Atau gunakan existing user dan update environment variable.

3. **Create screenshots directory:**

   ```bash
   mkdir -p screenshots
   ```

## Browser Tests

### 1. 🔥 Browser Smoke Test (1 menit)

**Purpose:** Quick verification - apakah UI dan basic functionality work?

```bash
pnpm k6:browser:smoke
```

**Detail:**

- Virtual Users: 1 (1 browser)
- Duration: 1 minute
- Best for: CI/CD, quick UI checks

**What it tests:**

- ✅ Login page loads correctly
- ✅ Can login successfully
- ✅ Admin users page accessible
- ✅ Table renders with data
- ✅ All UI elements present

---

### 2. 🌐 Browser Test (30 detik)

**Purpose:** Comprehensive UI testing dengan screenshots

```bash
pnpm k6:browser
```

**Detail:**

- Virtual Users: 1 browser
- Duration: ~30 seconds
- Best for: UI validation, debug dengan screenshots

**What it tests:**

- ✅ Full login flow
- ✅ Navigate to admin users
- ✅ Test pagination clicks
- ✅ Test search functionality
- ✅ Test sorting interactions
- ✅ Captures screenshots

---

### 3. 🌐 Browser Load Test (5 menit)

**Purpose:** Multiple users dengan real browsers

```bash
pnpm k6:browser:load
```

**Detail:**

- Virtual Users: 1 → 3 browsers
- Duration: ~5 minutes
- Best for: Performance testing dengan real users

⚠️ **Warning:** Each VU opens a real browser - resource intensive!

**Metrics provided:**

- 📊 Web Vitals (FCP, LCP, CLS, FID, INP, TTFB)
- 📊 Browser HTTP metrics
- 📊 User interaction timings

---

## Custom Configuration

Gunakan environment variables untuk override settings:

```bash
# Custom URL
k6 run -e BASE_URL=http://localhost:3000 k6-browser-test.js

# Custom credentials
k6 run \
  -e BASE_URL=http://localhost:3000 \
  -e TEST_EMAIL=admin@example.com \
  -e TEST_PASSWORD=mypassword \
  k6-browser-test.js
```

## Understanding Results

### ✅ Good Performance

```
✓ login page loads
✓ login succeeds
✓ admin users page loads
✓ table renders
✓ table has data

checks.........................: 100.00% ✓ 10      ✗ 0

WEB_VITALS
browser_web_vital_fcp..........: avg=1.82s min=1.82s med=1.82s max=1.82s
browser_web_vital_lcp..........: avg=2.14s min=2.14s med=2.14s max=2.14s
browser_web_vital_cls..........: avg=0     min=0     med=0     max=0
```

### ❌ Poor Performance

```
✗ login page loads
✗ login succeeds
✗ admin users page loads

checks.........................: 30.00% ✓ 3       ✗ 7

WEB_VITALS
browser_web_vital_fcp..........: avg=5.23s min=5.23s med=5.23s max=5.23s
browser_web_vital_lcp..........: avg=8.45s min=8.45s med=8.45s max=8.45s
```

## Key Metrics

| Metric                    | Description                | Good   | Bad    |
| ------------------------- | -------------------------- | ------ | ------ |
| `browser_web_vital_fcp`   | First Contentful Paint     | <1.8s  | >3s    |
| `browser_web_vital_lcp`   | Largest Contentful Paint   | <2.5s  | >4s    |
| `browser_web_vital_cls`   | Cumulative Layout Shift    | <0.1   | >0.25  |
| `browser_web_vital_fid`   | First Input Delay          | <100ms | >300ms |
| `browser_web_vital_inp`   | Interaction to Next Paint  | <200ms | >500ms |
| `browser_http_req_failed` | Browser request error rate | <5%    | >10%   |

## Troubleshooting

### ❌ "Browser not found"

```bash
# Install Chromium
brew install chromium  # macOS
sudo apt-get install chromium-browser  # Linux
```

### ❌ "Timeout waiting for element"

Increase timeout atau verify selector:

```bash
# Check if app is running
curl http://localhost:3000
# Start app if needed
pnpm dev
```

### ❌ "Login failed"

```bash
# Verify test user exists
pnpm seed:users
# Or check your environment variables
echo $TEST_EMAIL
echo $TEST_PASSWORD
```

### ❌ High memory usage

Browser tests use significant memory:

- Limit concurrent VUs to 3-5
- Close pages properly
- Use headless mode: `headless: true`

## Screenshots

Browser tests automatically save screenshots to `screenshots/` directory:

- `admin-users.png` - Success screenshot
- `error.png` - Error debugging
- `smoke-test-error.png` - Test failures

Check screenshots untuk visual debugging! 🔍

## Next Steps

1. ✅ Install K6 dan Chromium
2. ✅ Start app: `pnpm dev`
3. ✅ Run browser smoke test: `pnpm k6:browser:smoke`
4. ✅ Review results dan screenshots
5. ✅ Run comprehensive test: `pnpm k6:browser`
6. ✅ Run load test: `pnpm k6:browser:load`
7. ✅ Analyze Web Vitals metrics

## Resources

- 📖 [Browser Testing Documentation](./K6_BROWSER_TESTING.md)
- 📊 [Files Summary](./K6_FILES_SUMMARY.md)
- 🌐 [K6 Official Docs](https://k6.io/docs/)
- 🌐 [K6 Browser Docs](https://grafana.com/docs/k6/latest/using-k6-browser/)
- 💬 [K6 Community Forum](https://community.k6.io/)

---

## Rekomendasi Testing Strategy

```
┌─────────────────────────────────────────────┐
│ Development                                 │
├─────────────────────────────────────────────┤
│ 1. Run Browser Smoke Test after changes     │
│    pnpm k6:browser:smoke                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Before Deployment                           │
├─────────────────────────────────────────────┤
│ 1. Run Comprehensive Browser Test           │
│    pnpm k6:browser                          │
│ 2. Check screenshots                        │
│ 3. Verify Web Vitals metrics                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Performance Testing                         │
├─────────────────────────────────────────────┤
│ 1. Run Browser Load Test                    │
│    pnpm k6:browser:load                     │
│ 2. Monitor Web Vitals                       │
│ 3. Check for performance degradation        │
└─────────────────────────────────────────────┘
```
