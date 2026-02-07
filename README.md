# @homunculuslabs/plugin-zai

z.ai provider plugin for elizaOS.

This plugin speaks **z.ai’s Anthropic-compatible API** (the “GLM Coding Plan” endpoint) and provides:
- Text generation: `TEXT_SMALL`, `TEXT_LARGE`
- Structured JSON/object generation: `OBJECT_SMALL`, `OBJECT_LARGE`

Internally it reuses the official Anthropic AI SDK (`@ai-sdk/anthropic`), but **configuration and runtime identity are z.ai-native** (all settings are `ZAI_*`, events emit `source: "zai"`, plugin name is `"zai"`).

## Install

```bash
npm install @homunculuslabs/plugin-zai
# or
bun add @homunculuslabs/plugin-zai
```

## Usage

```ts
import { AgentRuntime, ModelType } from "@elizaos/core";
import zaiPlugin from "@homunculuslabs/plugin-zai";

const runtime = new AgentRuntime({
  plugins: [zaiPlugin],
});

const text = await runtime.useModel(ModelType.TEXT_LARGE, {
  prompt: "Summarize this repo in 5 bullets.",
});

const obj = await runtime.useModel(ModelType.OBJECT_SMALL, {
  prompt: "Create a JSON object with message: hello",
  schema: { type: "object" },
});
```

## Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `ZAI_API_KEY` | Yes | – | z.ai API key |
| `ZAI_BASE_URL` | No | `https://api.z.ai/api/anthropic/v1` | Anthropic-compatible base URL (should end in `/v1`) |
| `ZAI_SMALL_MODEL` | No | `claude-sonnet-4-20250514` | Small model id (z.ai maps Claude-style ids server-side) |
| `ZAI_LARGE_MODEL` | No | `claude-sonnet-4-20250514` | Large model id |

Optional advanced settings are also supported (telemetry + CoT budget):
- `ZAI_EXPERIMENTAL_TELEMETRY`
- `ZAI_COT_BUDGET`, `ZAI_COT_BUDGET_SMALL`, `ZAI_COT_BUDGET_LARGE`

## Notes

- This package is currently published under the `@homunculuslabs` scope as a staging step.
- Goal is to upstream as an official `@elizaos/plugin-zai` once stabilized.
