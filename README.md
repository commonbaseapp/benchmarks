# benchmarks

## Install dependencies:

```bash
bun install
```

## Setup .env
Copy the `.env.example` file to `.env` and fill in the values.

## Run the benchmark

```bash
bun providers.ts > providers-$(date +%s).csv
```

## Analysis

The results of our benchmarks and the analysis of the results can be found in the [analysis](./analysis) folder.
We ran two different benchmarks for the `gpt-4` and `gpt-3.5-turbo` model.
1. Single token completion (max_tokens=1)
2. 128 tokens completion (max_tokens=128)

The used prompts can be found in the [providers.ts](./providers.ts) file.
