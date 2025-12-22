---
title: Observability Baseline
description: Establish a consistent telemetry surface before onboarding workloads.
updatedAt: 2024-11-05
tags:
  - tracing
  - metrics
  - dashboards
collection: observability
collectionLabel: Observability
version: "2024 Q4"
versionSlug: overview
---

## Why this matters

Reliable dashboards and alerts depend on predictable signals. This baseline locks in a minimal telemetry contract so new services inherit the same trace attributes, metric names, and log keys.

### Core checklist

- Emit request, dependency, and queue spans with shared trace IDs.
- Forward deployment, region, and tenant labels with every metric.
- Normalize structured logs with `severity`, `service`, and `component` fields.

### Rollout tips

1. Start with staging namespaces and mirror traffic where possible.
2. Validate alerts on canary services before expanding coverage.
3. Keep a changelog in the runbook so teams can replay the rollout.
