# Documentation Maintenance Checklist

Use this checklist when updating AI instructions or implementing features.

## When Implementing Features

### Before Starting

- [ ] Read relevant section in `project.instructions.md`
- [ ] Check `AI_AGENT_SUPPORT.md` for existing implementation
- [ ] Review patterns in `coding.instructions.md`
- [ ] Scan related code files for examples

### During Implementation

- [ ] Follow TypeScript rules (const, interfaces, explicit types)
- [ ] Use Tailwind for all styling
- [ ] Extract logic into custom hooks where appropriate
- [ ] Add comments for complex logic
- [ ] Handle errors gracefully

### After Completion

- [ ] Update `AI_AGENT_SUPPORT.md`:
  - [ ] Move feature from pending to done
  - [ ] Update implementation details
  - [ ] Add any new interfaces/types
- [ ] Check if `project.instructions.md` needs updates
- [ ] Verify code follows `coding.instructions.md` patterns

## When Updating Documentation

### Adding New Feature

- [ ] Add to roadmap in `AI_AGENT_SUPPORT.md`
- [ ] Update feature list in `project.instructions.md` if needed
- [ ] Document any new patterns in `coding.instructions.md`

### Changing Architecture

- [ ] Update `project.instructions.md` architecture section
- [ ] Update folder structure if changed
- [ ] Update cross-references in other docs

### Adding New Guidelines

- [ ] Add to `coding.instructions.md` with examples
- [ ] Use clear format for clarity
- [ ] Include code examples
- [ ] Link from `copilot-instructions.md` if critical

## Monthly Review

- [ ] Check all links work
- [ ] Verify examples match current code
- [ ] Remove outdated information
- [ ] Update status in `AI_AGENT_SUPPORT.md`
- [ ] Add new learnings to guidelines

## Documentation Quality Standards

### All Documents Should:

- [ ] Use clear, concise language
- [ ] Include visual hierarchy (headers, lists)
- [ ] Provide concrete examples
- [ ] Link to related docs
- [ ] Be scannable (not walls of text)

### Code Examples Should:

- [ ] Follow current coding guidelines
- [ ] Show both good and bad examples
- [ ] Be realistic (from actual code)
- [ ] Include types and imports if relevant

### Status Updates Should:

- [ ] Use clear markers for completed
- [ ] Use clear markers for planned
- [ ] Include dates for major milestones
- [ ] Link to relevant commits/PRs

## Red Flags to Avoid

- Duplicated information across files
- Outdated examples that don't match current code
- Broken links to other docs
- Vague guidelines ("try to...", "consider...")
- Missing cross-references
- Walls of text without structure

## Quick Self-Check Questions

Before committing doc changes, ask:

1. **Is it clear?** Could a new team member understand it?
2. **Is it unique?** Am I duplicating content from another doc?
3. **Is it linked?** Do related docs reference this?
4. **Is it current?** Do examples match the codebase?
5. **Is it scannable?** Can I find info in 10 seconds?

## Contact & Updates

Last comprehensive review: December 27, 2025

Document structure established by: AI Optimization Session

Maintained by: Project team
