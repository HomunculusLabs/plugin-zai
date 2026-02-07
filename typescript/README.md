# @homunculuslabs/plugin-zai

z.ai provider plugin for elizaOS.

This plugin targets **z.ai’s Anthropic-compatible API** and supports:
- `TEXT_SMALL`, `TEXT_LARGE`
- `OBJECT_SMALL`, `OBJECT_LARGE`

## Install

```bash
npm install @homunculuslabs/plugin-zai
# or
bun add @homunculuslabs/plugin-zai
```

## Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `ZAI_API_KEY` | Yes | – | z.ai API key |
| `ZAI_BASE_URL` | No | `https://api.z.ai/api/anthropic/v1` | Anthropic-compatible base URL (should end in `/v1`) |
| `ZAI_SMALL_MODEL` | No | `claude-sonnet-4-20250514` | Small model id |
| `ZAI_LARGE_MODEL` | No | `claude-sonnet-4-20250514` | Large model id |

## Quick start

```ts
import { AgentRuntime, ModelType } from "@elizaos/core";
import zaiPlugin from "@homunculuslabs/plugin-zai";

const runtime = new AgentRuntime({ plugins: [zaiPlugin] });

const text = await runtime.useModel(ModelType.TEXT_LARGE, {
  prompt: "Write a haiku about local-first AI.",
});

console.log(text);
```
