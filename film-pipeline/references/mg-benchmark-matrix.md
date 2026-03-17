# MG Benchmark Matrix

Use this file to expand MG references by subtype instead of collecting examples randomly.

The goal is not to build a huge gallery. The goal is to maintain a compact matrix of representative MG lanes so the pipeline learns range without collapsing into one default style.

## How To Use This Matrix

For each MG-adjacent project:

1. identify the dominant MG sub-lane
2. pull only the benchmark cases that match that lane
3. extract transferable guardrails
4. extract freshness levers
5. ignore case-specific surface choices unless the user explicitly wants them

Do not combine all benchmark cases into one average style.

## Current Benchmark Slots

### 1. Workflow-Led Enterprise MG

Purpose:

- explain a workflow, process, or organizational intelligence loop

Current benchmark:

- [super-rep-mg-case.md](super-rep-mg-case.md)

Good for:

- enterprise AI explainers
- internal adoption explainers
- business workflow systems
- multi-step support platforms

Distinctive signals:

- process clarity
- card and UI logic
- section flow such as before / during / after
- enterprise-system tone

### 2. Product-World Geometric MG

Purpose:

- explain a platform or product through a coherent visual world and modular feature system

Current benchmark:

- [iot-product-mg-case.md](iot-product-mg-case.md)

Good for:

- product platform explainers
- connectivity or infrastructure products
- modular feature ecosystems
- concept-led technology explainers

Distinctive signals:

- geometry-first world-building
- modular service blocks
- abstract spatial transitions
- stronger product-object presence

## Recommended Missing Slots

These are the next high-value MG benchmark lanes to add.

### 3. Data-Visualization MG

Need:

- a benchmark where numbers, charts, and metric storytelling dominate

Why:

- this is different from both workflow MG and product-world MG

### 4. UI-Led MG

Need:

- a benchmark where interface states and interactions drive the piece, but it still reads as MG rather than plain screen recording

Why:

- helps separate `MG Explainer` from `UI Demo / Screenflow`

### 5. Typography-Led MG

Need:

- a benchmark where motion type, slogan rhythm, and textual emphasis lead the design system

Why:

- useful for sharper brand or opener-style MG hybrids

### 6. Abstract-Metaphor MG

Need:

- a benchmark where meaning is carried mostly through metaphor, symbolic transformation, and minimal literal UI

Why:

- prevents all MG from collapsing into cards and dashboards

### 7. Textured / Editorial MG

Need:

- a benchmark with stronger texture, collage, editorial framing, or non-flat finish

Why:

- prevents the pipeline from equating MG only with clean flat-vector graphics

## Selection Rule For New Benchmarks

A new benchmark is worth adding only if it contributes a genuinely new lane.

Do add it when:

- it shows a different dominant MG sub-lane
- it teaches a different Step 2 structure
- it changes Step 3 prompt behavior
- it changes Step 4 production logic

Do not add it when:

- it is just a surface variation of an existing lane
- the palette changes but the structure does not
- it duplicates another benchmark's production logic

## Good Matrix Standard

A healthy MG matrix should let the system answer:

- is this project workflow-led, product-led, data-led, UI-led, typography-led, or metaphor-led
- which benchmark lane is closest
- which guardrails transfer
- which freshness levers remain open

The matrix should reduce type drift without making all MG projects look alike.
