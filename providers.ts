import { shuffle } from "lodash";

// run benchmark N times
const N = 100;
const SHOW_COMPLETIONS = false;

const benchmarkParams = {
  // 128 token test case
  // messages: [{ role: "system", content: `tell me a longer chuck norris joke` }],
  // maxTokens: 128,

  // single token test case
  messages: [{ role: "system", content: `just respond with hello` }],
  maxTokens: 1,

  model: "gpt-4",
  // model: "gpt-3.5-turbo",

  temperature: 0.01, // reduce randomness
};

const openaiTestPayload = JSON.stringify({
  messages: benchmarkParams.messages,
  user: "benchmark",
  model: benchmarkParams.model,
  max_tokens: benchmarkParams.maxTokens,
  temperature: benchmarkParams.temperature,
});

const commonbaseTestPayload = JSON.stringify({
  projectId: process.env.COMMONBASE_PROJECT_ID!,
  messages: benchmarkParams.messages,
  userId: "benchmark",
  providerConfig: {
    provider: "cb-openai",
    params: {
      type: "chat",
      model: benchmarkParams.model,
      max_tokens: benchmarkParams.maxTokens,
      temperature: benchmarkParams.temperature,
    },
  },
});

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

async function callCommonbase() {
  const res = await fetch("https://api.commonbase.com/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.COMMONBASE_API_KEY!,
      "commonbase-show-usage": "on",
    },
    body: commonbaseTestPayload,
  });
  if (!res.ok) {
    console.error(await res.json());
    throw new Error(
      `Failed to call Commonbase: ${res.status} ${res.statusText}`,
    );
  }
  const json = (await res.json()) as any;
  if (!json.completed) {
    throw new Error(`Commonbase did not complete: ${JSON.stringify(json)}`);
  }
  SHOW_COMPLETIONS && console.error(json.choices[0]);
  return json.usage as Usage;
}

async function callOpenai() {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: openaiTestPayload,
  });
  if (!res.ok) {
    // console.error(await res.json());
    throw new Error(`Failed to call OpenAI: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as any;
  if (!json.choices || !json.choices.length) {
    throw new Error(`OpenAI did not complete: ${JSON.stringify(json)}`);
  }
  SHOW_COMPLETIONS && console.error(json.choices[0]);
  return json.usage as Usage;
}

const allProviders = [callOpenai, callCommonbase];

// log to stdout as csv
async function measureAndLog(runId: number, fn: () => Promise<Usage>) {
  const start = performance.now();
  const usage = await fn();
  const now = performance.now();
  const duration = now - start;
  process.stdout.write(
    `${now},${runId},${fn.name},${duration},${usage.prompt_tokens},${usage.completion_tokens},${benchmarkParams.model},${benchmarkParams.maxTokens},${benchmarkParams.temperature}\n`,
  );
}

async function callProviders(runId: number) {
  for (const p of shuffle(allProviders)) {
    await measureAndLog(runId, p);
  }
}

async function main() {
  // write CSV header
  process.stdout.write(
    `timestamp,run,function,duration,prompt_tokens,completion_tokens,model,max_tokens,temperature\n`,
  );
  for (let i = 0; i < N; i++) {
    process.stderr.write(`run ${i} (${Math.round((i / N) * 100)}%)\n`);
    await callProviders(i);
  }
}

main().catch(console.error);
