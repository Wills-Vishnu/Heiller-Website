# Dedicated Team Spacing and Idle Orbit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the gap above Dedicated Team and give its pills a continuous 28-second idle orbit while preserving scroll response.

**Architecture:** Update scoped spacing values in `index.html` and add a tested idle angular velocity to `dedicated-team.ts`. The existing animation lifecycle remains unchanged; only the target velocity calculation gains a nonzero visible, non-reduced-motion baseline.

**Tech Stack:** HTML, CSS, TypeScript, Node test runner, Vite.

## Global Constraints

- Idle orbit completes one clockwise lap every exactly 28 seconds.
- Scroll input continues to accelerate or reverse the orbit.
- Reduced-motion mode remains stationary and unblurred.
- No unrelated section, label, palette, geometry, or dependency changes.
- Git commits are unavailable because `D:\Design\Heiller` is not a Git repository.

---

### Task 1: Add Failing Spacing and Idle-Speed Regression Tests

**Files:**
- Modify: `tests/dedicated-team.test.mjs`
- Test: `index.html`
- Test: `dedicated-team.ts`

**Interfaces:**
- Consumes: CSS source and exported `IDLE_ANGULAR_VELOCITY`.
- Produces: exact-value regression coverage for spacing and the 28-second lap.

- [ ] Add assertions for `padding-bottom: 96px`, tablet `64px`, mobile `48px`, Dedicated Team top clamp `clamp(40px, 3.5vw, 64px)`, and mobile `40px`.
- [ ] Assert the motion source exports `IDLE_ORBIT_DURATION_SECONDS = 28` and calculates `IDLE_ANGULAR_VELOCITY = TAU / IDLE_ORBIT_DURATION_SECONDS`.
- [ ] Run `npm test`; expect the new assertions to fail against the current values.

### Task 2: Implement Exact Spacing and Idle Orbit

**Files:**
- Modify: `index.html`
- Modify: `dedicated-team.ts`
- Test: `tests/dedicated-team.test.mjs`

**Interfaces:**
- Produces: `IDLE_ORBIT_DURATION_SECONDS` and `IDLE_ANGULAR_VELOCITY`.
- Consumes: existing scroll velocity, intersection state, page visibility, and reduced-motion state.

- [ ] Change Services bottom padding values from `192px/96px/72px` to `96px/64px/48px` across desktop, tablet, and mobile rules.
- [ ] Change Dedicated Team desktop top padding to `clamp(40px, 3.5vw, 64px)` and mobile top padding to `40px`, preserving horizontal and bottom values.
- [ ] Export `IDLE_ORBIT_DURATION_SECONDS = 28` and `IDLE_ANGULAR_VELOCITY = TAU / IDLE_ORBIT_DURATION_SECONDS`.
- [ ] Set target velocity to zero for reduced motion, otherwise use `IDLE_ANGULAR_VELOCITY + getTargetAngularVelocity(sampledScrollVelocity)` for fresh scroll input and `IDLE_ANGULAR_VELOCITY` while idle.
- [ ] Run `npm test && npm run build`; expect all tests and TypeScript compilation to pass.

### Task 3: Runtime Verification

**Files:**
- Modify only if verification finds a defect: `index.html`, `dedicated-team.ts`

**Interfaces:**
- Consumes: completed spacing and orbit behavior.
- Produces: verified desktop/mobile layout and idle/scroll motion.

- [ ] At desktop size, confirm the new section starts closer to Services and pill transforms change without scrolling.
- [ ] Scroll and confirm the orbit accelerates or reverses without console warnings.
- [ ] At 393px, confirm the smaller gap, no overflow, and pills remain inside the field.
- [ ] Run the final `npm test && npm run build` verification.

