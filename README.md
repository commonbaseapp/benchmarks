# benchmarks

This repo includes a performance analysis comparing Commonbase API to OpenAI's API. It includes:

* a script to generate live benchmarks comparing Commonbase performance to OpenAI
* benchmarks ran by us on Sep 15, 2023
* a python notebook showing the analysis of the recorded benchbmarks.

## Install dependencies:

```bash
bun install
```

in case you are less adventurous and don't yet have bun, here you go: [Install Bun](https://bun.sh/docs/installation)

## Setup .env
Copy the `.env.example` file to `.env` and fill in the values.

### Get COMMONBASE_API_KEY
Sign up on [Commonbase](https://commonbase.com/login) and copy the API key from the onboarding flow.

### Get COMMONBASE_PROJECT_ID
Copy the Project ID from Settings in the web app.

### Get COMMONBASE_PROJECT_ID
Create a new OpenAI API key from [OpenAI API keys](https://platform.openai.com/account/api-keys)

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
