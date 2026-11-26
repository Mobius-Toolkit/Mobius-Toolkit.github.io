---
title: Roles and Harness settings
description: Learn which agents Mobius runs, and how to choose the Harness, the model and the effort of each one.
sidebar:
  order: 4
---

Mobius runs its agents as sessions. Each session has a Role. A Role is a job, for example the Lead or the Reviewer. Each Role has its own Harness, model and effort. This guide lists the Roles and tells how to change their settings.

A Harness is an agent program, for example Claude Code. The model is the language model that the Harness uses. The effort is the level of reasoning that the model gives.

## Roles

| Role | What it does | When Mobius starts it |
| --- | --- | --- |
| Coordinator | Talks with you in the Coordinator chat. Puts your requests into Workstreams. | When you write in the Coordinator chat of an organization. |
| Lead | Plans the tasks of one Workstream. Talks with you in its chat. Approves the pull requests. | One Lead runs each Workstream. Mobius also sends it events. |
| Implementer | Writes the code of a task. Does the fix rounds, the CI fix rounds and the conflict rounds. | When a task starts, and in each round of its pull request. |
| Reviewer | Reviews a pull request. Gives its findings as review comments. | For each new head of a pull request, after `.mobius/check` passes. |
| Judge | Sorts the new comments on a pull request into fixes, questions, follow-ups and rejects. | When a trusted user or a trusted bot adds a comment, after the review quiet period. |
| Diagnoser | Reads the job logs of a failed CI run and finds the cause. | When a CI run of a pull request or of the default branch fails. |
| Researcher | Answers a question about the code of a repository. Changes nothing. | When the Coordinator, a Lead or the Triager asks a question. |
| Operator | Does work outside code for one Workstream, through its MCP servers. Reports to the Lead. | When the Lead starts it. |
| Triager | Discusses an issue that has no Workstream with you. Proposes a Workstream or a message to a Lead. | When an issue has no Workstream. It works in the comments of the issue. |
| Curator | Keeps the memory files of a repository up to date. In the skill repository, it also proposes skills. | After 10 sessions of a repository ended since the last Curator session. |

The key `review_quiet_period` in `config.toml` sets the review quiet period. The default is 10 minutes.

For the task flow, see the guide [Workstreams, Projects and tasks](/guides/workstreams/). For Autopilot, see the guide [Autopilot and the global switches](/guides/autopilot/).

## Harnesses and models

Mobius supports these Harnesses:

| Harness | Value in `config.toml` | Program on `PATH` |
| --- | --- | --- |
| Claude Code | `claude-code` | `claude-agent-acp` |
| Antigravity | `antigravity` | `agy_acp_server` |
| Devin | `devin` | `devin` |
| DeepSeek Harness (dsh) | `dsh` | `dsh` |
| Codex | `codex` | `codex-acp` |

Mobius has no fixed list of models. Each Harness gives its own models and effort levels. Mobius starts the Harness and reads them. The Roles page shows only the values that the Harness gives. The effort field is there only when the Harness gives effort levels for the selected model.

These values show how the names look:

- Claude Code gives names such as `opus` and `sonnet`.
- Codex gives names such as `gpt-5.6-terra`.
- dsh gives a route and a model name, with a `/` between them, for example `deepseek-account/deepseek-v4-pro`. Its effort is `off`, `low`, `high` or `max`.

Only Claude Code has a context limit. The context limit is the largest context of a session in tokens. It is from 100000 to 1000000. For the other Harnesses, the field is off.

Mobius needs only the Harnesses that your Roles use. To install and log in to a Harness, see the guide [Install and first start](/guides/install/). Read the terms of each Harness in the section [Install and log in to the Harnesses](https://github.com/Mobius-Toolkit/Mobius/blob/main/docs/install.md#3-install-and-log-in-to-the-harnesses).

## The Roles page

The Roles page lists each Role with its Harness, model, effort and limit of agents. To open it, select **Settings**, and then **Roles**. Its path is `/settings/roles`.

To change a Role:

1. Click the row of the Role.
2. Change the fields. Each field is one of these:
   - **Harness**: the agent program.
   - **Model**: the model of the Harness.
   - **Effort**: the effort level of the model.
   - **Max**: the largest number of agents of this Role that run at the same time. It must be 1 or more.
   - **Context**: the context limit. It is only for Claude Code.
3. Click **Save**.

Mobius refuses a save in these cases:

- The program of the Harness is not on the `PATH` of the agents.
- The Harness does not give the effort for the model.
- The access check fails. Mobius runs the check when the Harness, the model or the effort changes. The guide [Install and first start](/guides/install/) describes the access check.

An agent of a Role that runs keeps its settings. The next agent of the Role uses the new settings.

The page also shows where each value comes from. A value from the Roles page has the badge **UI**. A value with no badge comes from `config.toml`. To remove the **UI** values of a Role, click **Reset**. The Role then uses `config.toml` again.

When the limit of agents of a Role is full, a new agent of that Role waits. The page **Agents** shows the count and the limit of each Role.

### More than one Implementer binding

A binding is a Harness, a model, an effort and a limit of agents. The Implementer can have more than one binding. To add a binding, click **Add binding** in the sheet of the Implementer. To remove one, click **Remove**.

The limit of the Implementer is the sum of the limits of its bindings. For a new Implementer, Mobius takes a binding that has a free place and no pause. It takes the binding that has the fewest running agents. When a binding has a pause, Mobius uses another binding. A Harness has a pause when it reaches its usage limit.

## The setting of a Workstream and of a task

You can set the Harness, the model and the effort for one Workstream or for one task. This setting does not change the limit of agents or the context limit.

These Roles have such a setting:

- The Lead, for one Workstream.
- The Operator, for one Workstream.
- The Implementer, for one Workstream or for one task.

The other Roles have only the setting of the Role.

To set a Workstream:

1. Open the Workstream, and open its **Details** tab.
2. Click **Change** next to **Lead**, **Implementer** or **Operator**.
3. Select the Harness, the model and the effort. Click **Save**.

To set one task, open the **Tasks** tab of the Workstream. Click the settings button **Implementer of #N** on the row of the task.

The sheet shows the value that applies when you set nothing. To remove your setting, click **Use the default**. Mobius runs the access check when you save, as on the Roles page.

An agent that runs keeps its settings. The next agent uses the new setting.

### The order of the settings

Mobius takes the first setting that it finds, in this order:

1. The setting of the task. It is only for the Implementer.
2. The setting of the Workstream.
3. The setting of the Role.

Thus a task setting wins over the Workstream setting. The Workstream setting wins over the Role setting.

The setting of a Workstream or of a task gives only the Harness, the model and the effort. The limit of agents comes from the Role. The context limit also comes from the Role, and only for a Harness that has a context limit.

An Implementer session that has a setting of a task or of a Workstream never moves to another Harness when its Harness has a pause.

## The Usage page

The Usage page shows the tokens and the cost of the turns of the agents. To open it, select **Usage**. Its path is `/usage`.

The page has these tabs:

- **Cost**: the cost in USD and the number of sessions.
- **Tokens**: the input, output, cache read and cache write tokens, and the number of sessions.
- **Times**: the time of each step and each state of the tasks.
- **Skills**: the use of the skills.
- **Quality**: the review rounds, the fix rounds and the cost of each task.

To read the page:

1. Select the period: **Last 7 days**, **Last 30 days**, **This month** or **Custom**. For **Custom**, give the first and the last day.
2. Use the filters to keep only some values. The filters are Harness, Model, Model version, Effort, Role and Repository.
3. Use **Group by** to split the numbers by one field or more. The fields are the same as the filters.

Thus you can compare the cost of two models, or the tokens of each Role.

Each Harness gives different data:

- Claude Code gives the tokens and the cost.
- Devin gives the input, output and cache read tokens. It gives no cost.
- Antigravity, dsh and Codex give tokens that Mobius reads from their own files. They give no cost.

The Cost tab shows no cost for a turn when the Harness gives none. Thus the total cost is lower than the real cost when you use these Harnesses.
