import '@testing-library/jest-dom'

// Mock Firebase
jest.mock('./src/lib/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
