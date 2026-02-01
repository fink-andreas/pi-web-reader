# Pi Web Reader Agent Configuration

## ⚠️ CRITICAL: Read PRD .md Before Starting Any Work

**STRICT REQUIREMENT:** You MUST read the PRD document from Linear before proceeding with any work on this project.


### PRD Contents

The PRD contains the following critical information:

1. **Project Overview** - Purpose and scope of the pi-web-reader system
2. **Architecture** - System architecture and component design
3. **Requirements** - Functional and non-functional requirements
4. **Technical Specifications** - Detailed technical specifications
5. **Implementation Guidelines** - Best practices and coding standards

### Before Any Implementation Work

1. **ALWAYS** ensure with "git status" if on main and in sync with origin
2. **ALWAYS** use linear to start new issue and ensure correct git branch
3. **ALWAYS** read the PRD: `linear document view a91b8c9ef4f9`
4. Verify you understand the requirements and architecture decisions
5. Follow the exact structure and guidelines outlined
6. Implement according to specifications
7. Respect the defined scope and non-goals

### Project Context

- **Linear Project ID:** pi-web-reader
- **Project Name:** pi-web-reader
- **Status:** In Progress

## Linear Workflow

### Project Scope

**CRITICAL RULE:** Work is strictly limited to issues within the current project only.

- **STRICTLY** work only on issues that are in the current project (pi-web-reader)
- **NEVER** work on issues from other projects
- **ALWAYS** list also unassigned issues
- **HINT:** To list unassigned backlog issues: `linear issue list --project pi-web-reader -s backlog -U`
- If changes in other projects are required, create a new issue in that other project
- Always verify the issue's project context before starting work

### Strict Flow

**ALWAYS** follow this flow:

1. linear issue start
2. linear issue update -s Done
3. linear issue comment add [issueId] -b <text of short intermediate status of the issue implementation>
4. linear issue comment add [issueId] -b <text of final comment>
⚠️ **IMPORTANT:** Step 3 is REQUIRED - you MUST add a comment describing what changes were made before considering the issue complete. Even if you think it's trivial, always add a comment.
4. commit feature branch and push to main


### Comment Guidelines

When adding a status comment to a in-progress issue:
 - keep it short

When adding a comment to a completed issue, include:
- Summary of changes made
- Files modified
- Commit hash (if applicable)
- Any relevant notes or edge cases

**Example:**
```bash
linear issue comment add INN-3 -b "Changes made:
- Added Limitations section to README.md
- Listed all non-goals as required by PRD
- All tests passing
- Commit: 0d375b9"
```

### Issue Completion Checklist

Before considering an issue complete:
- [ ] All code changes committed and pushed
- [ ] Tests passing locally
- [ ] Issue state updated to Done
- [ ] Comment added with changes summary
- [ ] No TODO.md TODOs left for this issue 

### Quick Tips for Working with Linear

1. **Documents vs Issues**: Documents (PRDs, specs) use `linear document view <id>`. Issues (tasks, tickets) use `linear issue view <id>`. Don't confuse them.

2. **Never Use Browser Commands**: `--web` and `--app` flags will fail in headless environments. Use `linear issue url` for manual access or rely on CLI text output.

3. **State Names**: Use exact state names configured in your workspace (e.g., `Done`, `In Progress`). View the issue first to see available states before updating.

4. **Branch Naming**: Name branches like `inn-1-feature-description` - the CLI auto-detects issue ID from branch name for better integration.

