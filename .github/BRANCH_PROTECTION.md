# 🛡️ Branch Protection Configuration

## Setup in GitHub:

### For `main` branch (Production):

**Settings → Branches → Add rule:**
```
Branch name pattern: main

✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Status checks that are required:
      - frontend-tests
      - backend-tests
      - test-gate

✅ Require conversation resolution before merging

✅ Do not allow bypassing the above settings
```

### For `staging` branch:

**Settings → Branches → Add rule:**
```
Branch name pattern: staging

✅ Require status checks to pass before merging
   Status checks that are required:
      - frontend-tests
      - backend-tests

⬜ Require pull request reviews: No (for faster iteration)
```

## Testing Workflow:
```
1. Developer creates feature branch
2. Commits code + tests
3. Push triggers test suite
4. Create PR to staging
5. Tests must pass ✅
6. Merge to staging (auto-deploy)
7. Manual testing in staging
8. Create PR staging → main
9. Tests + 1 approval required ✅
10. Merge to main (deploy to production)
```

## Emergency Hotfix:
```
1. Create hotfix branch from main
2. Fix + tests
3. PR directly to main
4. Bypass review if critical (use sparingly)
5. Fast-track to production
6. Backport to staging
```
