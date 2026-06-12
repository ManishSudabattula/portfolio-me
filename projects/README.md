# AI + Data Product Lab

This folder contains three research-backed, interactive product prototypes. They are intentionally designed as systems projects rather than generic model demos.

## Projects

### EvidenceGrid

An evaluation workbench for retrieval-augmented generation. It decomposes quality into retrieval relevance, claim support, answer relevance, and operational cost so teams can compare prompt and retrieval configurations before release.

Research basis:

- [NIST AI 600-1: Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [RAGAS: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217)

### LineageGuard

An AI-assisted schema change control plane. It combines column-level lineage, data contracts, and a generated migration plan to show which downstream assets and business metrics are at risk before a breaking change ships.

Research basis:

- [OpenLineage object model](https://openlineage.io/docs/spec/object-model/)
- [OpenLineage column-level lineage facet](https://openlineage.io/docs/spec/facets/dataset-facets/column_lineage_facet/)
- [OpenLineage schema facet](https://openlineage.io/docs/spec/facets/dataset-facets/schema/)

### CarbonShift

A carbon-, cost-, and deadline-aware scheduler for flexible AI workloads. It demonstrates how batch inference, evaluation, and fine-tuning jobs can move to cleaner and cheaper time windows without violating delivery constraints.

Research basis:

- [IEA Energy and AI: Energy demand from AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai)
- [IEA Energy and AI executive summary](https://www.iea.org/reports/energy-and-ai/executive-summary)

## Scope

The current implementations are browser-based decision-support prototypes. They use deterministic local scenarios so reviewers can inspect the scoring logic without API keys. Production versions would add live model traces, OpenLineage events, grid-carbon feeds, authentication, persistent storage, and scheduled workers.
