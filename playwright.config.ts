import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'fs'
import { execSync } from 'child_process'

// Next.js dev server는 .env.local을 자동으로 로드하지만,
// 테스트 프로세스(Playwright runner) 자체는 별도 Node 프로세스 — 직접 로드 필요
if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local')
}

// Next.js 16은 같은 프로젝트의 dev 서버가 이미 실행 중이면 exit(1)로 종료.
// Playwright의 reuseExistingServer만으로는 이 상황에서 에러가 발생하므로,
// 포트 3000이 응답 중이면 webServer 설정 자체를 생략한다.
function isPort3000InUse(): boolean {
  try {
    execSync('node scripts/check-port.mjs 3000', { timeout: 2000, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

const serverAlreadyRunning = isPort3000InUse()

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Notion API rate limit 고려 — 직렬 실행
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 이미 실행 중이면 webServer 생략 — Next.js 16 duplicate lock 에러 방지
  ...(serverAlreadyRunning
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          url: 'http://localhost:3000',
          timeout: 120_000,
        },
      }),
})
