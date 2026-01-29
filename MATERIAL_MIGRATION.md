# Material Filtering Migration Guide

This guide explains how to migrate from string-based material content filtering to the new Material reference system.

## Overview

The new system adds a `material` content type in Sanity that works similarly to `color`:
- **Material Content field** (`content`) remains unchanged for display purposes
- **Materials field** is a new multi-reference field used for filtering
- Users can now filter by material type (Cotton, Linen, Silk, etc.) instead of exact content strings

## Migration Steps

### 1. Update Sanity Schema

The schema has been updated in `sanity/schema.ts` to include the new `material` type and add a `materials` field to `fabricItem`.

Deploy the schema changes to Sanity Studio:

\`\`\`bash
npm run dev
\`\`\`

Visit your Sanity Studio (usually at `http://localhost:3000/studio`) and verify the new Material content type appears.

### 2. Create Material Documents

Run the script to create common material types in Sanity:

\`\`\`bash
npx tsx scripts/create-materials.ts
\`\`\`

This will create material documents for:
- Cotton, Linen, Silk, Wool
- Polyester, Viscose, Rayon
- Cashmere, Mohair, Acrylic
- And 10+ more common materials

### 3. Migrate Existing Fabric Items

Run the migration script to associate materials with existing fabric items:

\`\`\`bash
npx tsx scripts/migrate-materials.ts
\`\`\`

This script will:
- Read each fabric item's `content` field
- Parse material names (e.g., "80% Cotton, 20% Linen" → Cotton, Linen)
- Create references to the appropriate material documents
- Update the `materials` field on each fabric item

The script logs progress and shows which items were updated or skipped.

### 4. Verify in Sanity Studio

1. Open Sanity Studio
2. Navigate to Fabric Items
3. Open any fabric item
4. Verify the "Materials" field is populated based on the content
5. The "Material Content" field should remain unchanged

## Filter UI Changes

The filter drawer now shows:
- **Material** category (instead of "Material Content")
- Individual material types with counts
- Multi-select checkboxes (select multiple materials at once)
- Material filters work the same as Color filters

## Data Structure

### Before
\`\`\`typescript
// Filtering by exact content string match
content: "80% Cotton, 20% Linen"
// Filter URL: ?material=80% Cotton, 20% Linen
\`\`\`

### After
\`\`\`typescript
// Display field (unchanged)
content: "80% Cotton, 20% Linen"

// New filtering field
materials: [
  { _ref: "cotton-id", name: "Cotton" },
  { _ref: "linen-id", name: "Linen" }
]
// Filter URL: ?material=cotton,linen
\`\`\`

## Troubleshooting

### Materials not appearing in filters
- Verify material documents were created: Check Sanity Studio → Materials
- Run the migration script again if needed (it's safe to re-run)

### Fabric items missing material associations
- Check the item's `content` field contains recognizable material names
- The migration script uses pattern matching - verify material names are spelled correctly
- You can manually add materials in Sanity Studio

### Adding new materials
1. Go to Sanity Studio → Materials
2. Click "Create new Material"
3. Enter name and generate slug
4. The new material will appear in filters immediately

## Rollback

To rollback this change:
1. Revert the schema changes in `sanity/schema.ts`
2. Remove the `materials` field from fabric items
3. The `content` field is preserved, so no data is lost

## Support

If you encounter issues, check:
- Environment variables are set correctly
- Sanity API token has write permissions
- All dependencies are installed (`npm install`)
