# Stories Archive

This directory contains completed user stories organized by year and month of completion.

## Structure

```
archive/
└── YYYY/           # Year of completion
    └── MM/         # Month of completion
        └── *.md    # Completed story files
```

## Archive Policy

Stories are moved here when:
- Status is marked as "Completed" or "Done"
- All acceptance criteria have been met
- Code has been merged to main branch
- Story has been verified in production/release

## Accessing Archived Stories

Archived stories remain accessible for:
- Historical reference
- Learning from past implementations
- Tracking project evolution
- Audit and compliance purposes

## Naming Convention

Archived stories retain their original naming:
- `XXX.YY.description.md`
- Where XXX is the epic number
- YY is the story number within that epic

## Moving Stories to Archive

To archive a completed story:
1. Verify story status is "Completed" or "Done"
2. Confirm all work is merged
3. Move file to `archive/YYYY/MM/` based on completion date
4. Update any active tracking documents

## Retrieving from Archive

If needed, stories can be retrieved from archive by:
1. Locating the story in the appropriate year/month folder
2. Copying (not moving) back to active stories if reopened
3. Creating a new story that references the archived one