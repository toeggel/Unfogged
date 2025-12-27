# Quick Decision Tree: Which Doc Should I Read?

Use this flowchart to quickly find the right documentation.

## Start Here: What Do You Need?

### "I'm new here, where do I start?"
→ **[README.md](./README.md)** (Documentation hub)  
→ Then **[copilot-instructions.md](./copilot-instructions.md)** (Overview)

### "What is this project about?"
→ **[project.instructions.md](./instructions/project.instructions.md)**  
Read: Vision, Goals, Architecture

### "How do I write code here?"
→ **[coding.instructions.md](./instructions/coding.instructions.md)**  
Find: TypeScript rules, React patterns, Tailwind usage

### "What's already built vs. what's planned?"
→ **[AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md)**  
See: Implemented, Planned, Roadmap

### "Should I use X or Y?"
→ **[coding.instructions.md](./instructions/coding.instructions.md)**  
Look for: Do this, Don't do that

Examples:
- `const` vs `let` → coding.instructions.md → Variables
- `interface` vs `type` → coding.instructions.md → Types
- Inline styles vs Tailwind → coding.instructions.md → Tailwind

### "What should I build next?"
→ **[AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md)**  
Check: Next Steps (Priority Order)

### "I need to update the docs"
→ **[MAINTENANCE.md](./instructions/MAINTENANCE.md)**  
Follow: Checklists and quality standards

## Quick Reference by Role

### As AI Assistant
1. **Every session**: Read [copilot-instructions.md](./copilot-instructions.md)
2. **Before coding**: Check [coding.instructions.md](./instructions/coding.instructions.md)
3. **Before implementing**: Check [AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md)

### As New Developer
1. Read [README.md](./README.md)
2. Read [project.instructions.md](./instructions/project.instructions.md)
3. Skim [coding.instructions.md](./instructions/coding.instructions.md)
4. Browse [AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md)

### As Maintainer
1. Update [AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md) after features
2. Check [MAINTENANCE.md](./instructions/MAINTENANCE.md) monthly
3. Update [coding.instructions.md](./instructions/coding.instructions.md) for new patterns

## Find by Question Type

| Question | Document | Section |
|----------|----------|---------|
| Why does this app exist? | project.instructions.md | Vision |
| What tech do we use? | project.instructions.md | Technical Stack |
| How is code organized? | coding.instructions.md | Code Organization |
| What's the code style? | coding.instructions.md | All sections |
| What's implemented? | AI_AGENT_SUPPORT.md | Implemented Features |
| What's next? | AI_AGENT_SUPPORT.md | Next Steps |
| How do I maintain docs? | MAINTENANCE.md | All sections |
| Where do I start? | README.md | Quick Start |
| What are the design principles? | project.instructions.md | Design Principles |
| How does routing work? | Check actual code | src/routes/ |
| How does storage work? | Check actual code | src/storage/ |

## Pro Tips

### Reading Efficiently
- Use Ctrl+F to search within documents
- Read headers first for overview
- Dive into sections as needed
- Follow links for more detail

### When in Doubt
1. Start with [copilot-instructions.md](./copilot-instructions.md)
2. It links to everything else
3. Use this decision tree

### Keep Docs Fresh
- Update [AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md) after every feature
- Review [MAINTENANCE.md](./instructions/MAINTENANCE.md) checklist
- Check links monthly

## Common Scenarios

### "I'm implementing fog decay"
1. Read [project.instructions.md](./instructions/project.instructions.md) → Fog System Design
2. Check [AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md) → Phase 1.1 tasks
3. Follow [coding.instructions.md](./instructions/coding.instructions.md) → Write code
4. Update [AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md) → Mark complete

### "I need to add a setting"
1. Check [AI_AGENT_SUPPORT.md](./AI_AGENT_SUPPORT.md) → Phase 3.1
2. Follow [coding.instructions.md](./instructions/coding.instructions.md) → React patterns
3. Update [project.instructions.md](./instructions/project.instructions.md) if architecture changes

### "Code review - does this follow guidelines?"
1. Open [coding.instructions.md](./instructions/coding.instructions.md)
2. Check each section (TypeScript, React, Tailwind)
3. Look for do/don't patterns

## Document Map

```
README.md ──────────────┬─────────────── Entry point
                        │
copilot-instructions.md ┼─────────────── Main hub
         │              │
         ├──────────────┼── project.instructions.md
         │              │
         ├──────────────┼── coding.instructions.md
         │              │
         └──────────────┼── AI_AGENT_SUPPORT.md
                        │
                        └── MAINTENANCE.md
```

**Remember**: All docs are cross-linked. If you're in the wrong place, there's a link to the right place!

