# 🧪 Testing Strategy - AchievingCoach

## Test Pyramid
```
        /\
       /  \      E2E Tests (5-10)
      /----\     Critical user journeys
     /      \    
    /--------\   Integration Tests (20-30)
   /  UNIT    \  API + Services + Firestore
  /-TESTS------\ 
 /   (50-100)   \ Pure functions + Components
/________________\
```

## Coverage Targets

- **Phase 1 (Week 1):** 40% coverage, critical paths
- **Phase 2 (Week 2-3):** 60% coverage, all services
- **Phase 3 (Month 1):** 80% coverage, comprehensive

## Test Categories

### 🔴 CRITICAL (Must Pass for Production)
- Authentication flows
- Protected routes
- Profile creation
- Organization operations
- Payment processing (future)

### 🟡 IMPORTANT (Should Pass)
- Tool assignments
- Goal tracking
- Session management
- Messaging

### 🟢 NICE TO HAVE
- UI components
- Formatting utilities
- Non-critical features

## CI/CD Integration

### Staging Deploy:
```yaml
1. Run unit tests
2. Run integration tests
3. Deploy to staging
4. Run E2E tests
5. Report results
```

### Production Deploy:
```yaml
1. All staging tests passed ✅
2. Manual approval required
3. Run smoke tests in prod
4. Monitor for errors
```

## Testing Tools

- **Unit/Integration:** Jest + React Testing Library
- **E2E:** Playwright
- **API:** Supertest
- **Coverage:** Istanbul/NYC
- **CI:** GitHub Actions (primary) + Cloud Build

## Test Naming Convention
```typescript
// Good
describe('ProtectedRoute', () => {
  describe('when user is not authenticated', () => {
    it('should redirect to sign-in', () => {
      // test
    });
  });
});

// Bad
test('protected route works', () => {});
```

## Running Tests
```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific file
npm test -- ProtectedRoute.test.tsx

# E2E
npm run test:e2e
```
