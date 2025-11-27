# Migration Scripts

## add-organization-id-migration.ts

Adds `organizationId` to all existing data in Firestore and Firebase Auth.

### What it does:

1. **Creates default organization** (`default-org`)
2. **Updates Firestore collections** with `organizationId`:
   - users
   - coaches
   - coachees
   - sessions
   - goals
   - reflections
   - grow_sessions
   - tool_assignments
   - wheel_of_life
   - disc_results
   - activities
   - tool_results

3. **Updates Firebase Auth users** with custom claims:
   - `organizationId`: default-org
   - `role`: coachee (default)

### Before Running:

⚠️ **IMPORTANT: Backup your data first!**
```bash
# Export Firestore data (optional but recommended)
gcloud firestore export gs://your-backup-bucket/backup-$(date +%Y%m%d)
```

### How to Run:
```bash
cd ~/achieving-coach/backend

# Install dependencies if needed
npm install

# Run migration
npx ts-node scripts/add-organization-id-migration.ts
```

### Expected Output:
```
🚀 Starting migration: Add organizationId to existing data

📋 Step 1: Creating default organization...
✅ Default organization created: default-org

📋 Step 2: Migrating Firestore collections...

📋 Migrating collection: users
  ✅ Updated 5 documents in 'users'

📋 Migrating collection: sessions
  ✅ Updated 12 documents in 'sessions'

...

📋 Step 3: Updating Firebase Auth users...
  ✅ Updated user: test@achievingcoach.com (W3uyX0...)
  ✅ Updated 6 Firebase Auth users

==================================================
🎉 Migration completed successfully!
==================================================
📊 Summary:
  - Organization created: default-org
  - Firestore documents updated: 45
  - Auth users updated: 6
==================================================
```

### Rollback:

If something goes wrong, you can:

1. Restore from backup
2. Manually remove `organizationId` field from documents
3. Reset custom claims for users

### Notes:

- Script is **idempotent** - safe to run multiple times
- Documents already with `organizationId` are skipped
- Auth users already with custom claims are skipped
- Uses batched writes (500 docs per batch) for efficiency

---

*Created: Nov 27, 2025*
