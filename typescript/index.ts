import type {
  GenerateTextParams,
  IAgentRuntime,
  JsonValue,
  ObjectGenerationParams,
  Plugin,
  TestCase,
  TestSuite,
} from "@elizaos/core";
import { logger, ModelType } from "@elizaos/core";
import { initializeZai, type PluginConfig } from "./init";
import { handleObjectLarge, handleObjectSmall, handleTextLarge, handleTextSmall } from "./models";
import { getApiKeyOptional } from "./utils/config";

export type { PluginConfig } from "./init";

const pluginTests = [
  {
    name: "zai_plugin_tests",
    tests: [
      {
        name: "zai_test_api_key_validation",
        fn: async (runtime: IAgentRuntime) => {
          const apiKey = getApiKeyOptional(runtime);
          if (!apiKey) {
            throw new Error("ZAI_API_KEY is not configured");
          }
          logger.log("z.ai API key is configured");
        },
      },
      {
        name: "zai_test_text_small",
        fn: async (runtime: IAgentRuntime) => {
          const text = await runtime.useModel(ModelType.TEXT_SMALL, {
            prompt: "What is the nature of reality in 10 words?",
          });

          if (typeof text !== "string" || text.length === 0) {
            throw new Error("Failed to generate text: empty response");
          }

          logger.log({ text }, "generated with test_text_small");
        },
      },
      {
        name: "zai_test_text_large",
        fn: async (runtime: IAgentRuntime) => {
          const text = await runtime.useModel(ModelType.TEXT_LARGE, {
            prompt: "What is the nature of reality in 10 words?",
          });

          if (typeof text !== "string" || text.length === 0) {
            throw new Error("Failed to generate text: empty response");
          }

          logger.log({ text }, "generated with test_text_large");
        },
      },
      {
        name: "zai_test_object_small",
        fn: async (runtime: IAgentRuntime) => {
          const result = await runtime.useModel(ModelType.OBJECT_SMALL, {
            prompt: "Create a simple JSON object with a message field saying hello",
            schema: { type: "object" },
          });

          if (!result || typeof result !== "object") {
            throw new Error("Failed to generate object: invalid response");
          }

          if ("error" in result) {
            throw new Error(`Failed to generate object: ${String(result["error"])}`);
          }

          logger.log({ result }, "Generated object with test_object_small");
        },
      },
      {
        name: "zai_test_object_large",
        fn: async (runtime: IAgentRuntime) => {
          const result = await runtime.useModel(ModelType.OBJECT_LARGE, {
            prompt: "Create a simple JSON object with a message field saying hello",
            schema: { type: "object" },
          });

          if (!result || typeof result !== "object") {
            throw new Error("Failed to generate object: invalid response");
          }

          if ("error" in result) {
            throw new Error(`Failed to generate object: ${String(result["error"])}`);
          }

          logger.log({ result }, "Generated object with test_object_large");
        },
      },
    ] as TestCase[],
  },
] as TestSuite[];

type ProcessEnvLike = Record<string, string | undefined>;

function getProcessEnv(): ProcessEnvLike {
  // In browsers, `process` is not defined (and we must not reference it unguarded).
  if (typeof process === "undefined") {
    return {};
  }
  return process.env as ProcessEnvLike;
}

const env = getProcessEnv();

export const zaiPlugin: Plugin = {
  name: "zai",
  description: "z.ai plugin (Anthropic-compatible; supports text and object generation)",

  config: {
    ["ZAI_API_KEY"]: env["ZAI_API_KEY"] ?? null,
    ["ZAI_SMALL_MODEL"]: env["ZAI_SMALL_MODEL"] ?? null,
    ["ZAI_LARGE_MODEL"]: env["ZAI_LARGE_MODEL"] ?? null,
    ["ZAI_EXPERIMENTAL_TELEMETRY"]: env["ZAI_EXPERIMENTAL_TELEMETRY"] ?? null,
    ["ZAI_BASE_URL"]: env["ZAI_BASE_URL"] ?? null,
    ["ZAI_BROWSER_BASE_URL"]: env["ZAI_BROWSER_BASE_URL"] ?? null,
    ["ZAI_COT_BUDGET"]: env["ZAI_COT_BUDGET"] ?? null,
    ["ZAI_COT_BUDGET_SMALL"]: env["ZAI_COT_BUDGET_SMALL"] ?? null,
    ["ZAI_COT_BUDGET_LARGE"]: env["ZAI_COT_BUDGET_LARGE"] ?? null,
  },

  async init(config, runtime) {
    initializeZai(config as PluginConfig, runtime);
  },

  models: {
    [ModelType.TEXT_SMALL]: async (
      runtime: IAgentRuntime,
      params: GenerateTextParams
    ): Promise<string> => {
      return handleTextSmall(runtime, params);
    },

    [ModelType.TEXT_LARGE]: async (
      runtime: IAgentRuntime,
      params: GenerateTextParams
    ): Promise<string> => {
      return handleTextLarge(runtime, params);
    },

    [ModelType.OBJECT_SMALL]: async (
      runtime: IAgentRuntime,
      params: ObjectGenerationParams
    ): Promise<Record<string, JsonValue>> => {
      const result = await handleObjectSmall(runtime, params);
      return result as unknown as Record<string, JsonValue>;
    },

    [ModelType.OBJECT_LARGE]: async (
      runtime: IAgentRuntime,
      params: ObjectGenerationParams
    ): Promise<Record<string, JsonValue>> => {
      const result = await handleObjectLarge(runtime, params);
      return result as unknown as Record<string, JsonValue>;
    },
  },

  tests: pluginTests as TestSuite[],
};

export default zaiPlugin;
