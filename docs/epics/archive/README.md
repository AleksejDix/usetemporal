# Epics Archive

This directory contains completed epics organized by year and month of completion.

## Structure

```
archive/
└── YYYY/           # Year of completion
    └── MM/         # Month of completion
        └── *.md    # Completed epic files
```

## Archive Policy

Epics are moved here when:
- All stories within the epic are completed
- Epic goals have been achieved
- No further work is planned under this epic
- Final epic review has been conducted

## Accessing Archived Epics

Archived epics remain accessible for:
- Project history and evolution
- Success metrics and outcomes
- Architecture decisions made
- Future reference for similar work

## Naming Convention

Archived epics retain their original naming:
- `epic-XXX-description.md`
- Where XXX is the epic number

## Moving Epics to Archive

To archive a completed epic:
1. Verify all stories are completed
2. Confirm epic goals are met
3. Document final outcomes in epic
4. Move file to `archive/YYYY/MM/` based on completion date
5. Update project roadmap/tracking documents

## Related Stories

When an epic is archived, its related stories should already be in the stories archive. The epic file should contain references to all completed stories for traceability.