# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>diagnosing-bugs</name>
<description>Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.</description>
<location>project</location>
</skill>

<skill>
<name>frontend-design</name>
<description>Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.</description>
<location>project</location>
</skill>

<skill>
<name>grill-me</name>
<description>A relentless interview to sharpen a plan or design.</description>
<location>project</location>
</skill>

<skill>
<name>handoff</name>
<description>Compact the current conversation into a handoff document for another agent to pick up.</description>
<location>project</location>
</skill>

<skill>
<name>improve-codebase-architecture</name>
<description>Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.</description>
<location>project</location>
</skill>

<skill>
<name>react-best-practices</name>
<description>React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.</description>
<location>project</location>
</skill>

<skill>
<name>skill-creator</name>
<description>Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.</description>
<location>project</location>
</skill>

<skill>
<name>tdd</name>
<description>Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
