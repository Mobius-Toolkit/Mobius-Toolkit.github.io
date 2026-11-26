---
title: Autopilot and the global switches
description: Let Mobius start and merge tasks by itself, and hold it with the global switches.
sidebar:
  order: 3
---

Autopilot lets Mobius start the tasks of a Workstream and merge their pull requests with no action from you. Each Workstream has its own level. Three global switches on the Settings page hold Mobius for all Workstreams.

For the task flow, see [Workstreams, Projects and tasks](/guides/workstreams/). For the role limits, see [Roles and Harness settings](/guides/roles/).

## Autopilot levels

A Workstream has one of four levels:

| Level | Mobius starts the tasks | Mobius merges |
| --- | --- | --- |
| Off | No. You start each task. | No. You merge each pull request. |
| Start tasks | Yes. | No. |
| Merge only | No. | Yes, after the Lead approves. |
| Start and merge | Yes. | Yes, after the Lead approves. |

Two labels on the Workstream issue set the level:

| Label | Meaning |
| --- | --- |
| `mobius:autopilot` | Mobius starts the tasks. |
| `mobius:auto-merge` | Mobius merges the pull requests. |

A Workstream with no label has the level Off. A Workstream with both labels has the level Start and merge.

To change the level in the web client:

1. Open the chat of the Workstream.
2. Select the Autopilot button at the top.
3. Select a level.

The change takes effect at once, and Mobius writes the labels on GitHub. You can also add or remove the labels on GitHub. Mobius reads them at the next poll.

When you lower the merge level, Mobius ends each automatic merge that did not finish. The pull request goes back to you, and the Inbox shows the button **Merge** again.

## The start of tasks

With the level Start tasks or Start and merge, Mobius walks the tasks of the Workstream in the order of its tree, depth first. It starts a task when all of these are true:

- The task issue is open.
- The task issue has no open blocker.
- The task issue is not a Project, and it does not have the label `mobius:triage`.
- A trusted user, a trusted bot, or the Mobius App created the task issue.
- The issue never had a task. Autopilot does not start an issue again after its task ended or stopped. Only you can start it again.

A task issue that waits for your answer to a question, and that you already answered, continues at the next poll.

### The limit of Implementers

Mobius counts the tasks that are dispatched, queued or working, in all Workstreams. When the count is equal to the limit, Mobius starts no new task. A task in checks or in review does not count.

The limit is the value `roles.implementer.max` in `config.toml`. The default is 2. To change it, use one of these ways:

- Change `max` in the section `[roles.implementer]` of `config.toml`, and restart Mobius.
- Open the page **Roles**, open the Implementer, and change the field **Max**. The value must be 1 or more.

### What stops the start

Mobius also starts no new task in these cases:

- An upgrade waits for the agents to end.
- The CI of the repository has a hard break. Mobius then starts only the task that repairs the break.
- A global switch is off. See the section "The global switches".

A task that Mobius did not start stays ready. Mobius starts it after the cause ends.

## The merge

With the level Merge only or Start and merge, Mobius merges a pull request after the Lead approves it.

1. The Reviewer reviews the pull request, and the Judge reads the findings. Each fix round changes the code for them.
2. The Lead approves the pull request. The approval is the check run `Mobius` on the head commit. The pull request is then ready for review, and the Inbox shows an item.
3. Mobius approves the pull request as the Owner. This is the same action as the button **Merge** in the Inbox.
4. Mobius puts the pull request in the merge queue and merges it with a squash merge.

Mobius does not approve or merge a pull request in these cases:

- The pull request is a draft.
- The pull request has a merge conflict.
- The pull request has an open review thread.
- A check run of the head failed or did not end.
- An open todo holds the merge.

### Todos that hold a merge

The Reviewer reports what must happen outside the code when the pull request merges, for example a deployment step. Mobius adds a todo item in the Inbox for each such need. A mandatory todo holds the merge until you close it. Another todo holds the merge until you close it or dismiss it.

While a todo holds the merge, the Inbox item of the pull request shows the reason "Mobius merges after you close the open todos." Mobius approves the pull request after the last todo closes.

### The merge queue

Each repository has one merge queue. Only the first pull request in the queue updates its branch and merges.

- The first position goes to a pull request that already started its branch update or its merge. A CI fix task is next. Then the other tasks follow, in the order that they entered the queue.
- When the branch is behind the default branch, and both change a common file, Mobius updates the branch of the pull request first. The new head needs the approval of the Lead again. The pull request keeps its place.
- When the first pull request stays in checks or in approval for more than 2 hours, and other pull requests wait, Mobius removes it from the queue.

## The global switches

The page **Settings** has the page **Switches**. It has three switches, and each is on by default. A switch is global: it acts on each Workstream of each organization, whatever the Autopilot level is.

| Switch | What it holds |
| --- | --- |
| Start | New tasks and new sessions of tasks. This includes a task that you start by hand. |
| Merge | The automatic merge of Mobius. |
| Repairs | The tasks of CI breaks, check timeouts and CI failures. |

A switch does not change the level of a Workstream. The level shows what you want, and a switch holds the work while it is off. The switch always wins over the level:

- With **Start** off, no task starts, also with the level Start tasks. Sessions that wait for a start show the reason "Autopilot paused: no task starts".
- With **Merge** off, Mobius does not approve a pull request for the merge. The Inbox item shows the reason "Autopilot paused: no automatic merge". An approval that you give with the button **Merge**, or on GitHub, still merges the pull request.
- With **Repairs** off, only the repair tasks wait. Other tasks start as usual. A repair task also waits when **Start** is off.

Mobius keeps the work that a switch holds. When you turn the switch on, Mobius forgets the hold and does the work at the next poll. The chat of the Lead shows a record when you turn a switch on or off.

## Stop a task

To stop a task that Mobius started:

1. Open the Workstream, and open the Tasks tab.
2. Click the button **Stop** on the row of the task.

Mobius stops the task and its agents, and it clears a waiting start. The button **Stop** shows for a task that is ready, working, in review, or waiting for an answer, and for a task whose start waits.

To continue the task, click the button **Start** on the same row. The task then continues in one of these ways:

- When the task has a pull request, Mobius continues with a fix round for the open review threads and the failed checks.
- When the task has no pull request, Mobius ends the old task and starts a new task for the issue.

Autopilot does not continue a stopped task. A task can also stop by itself, for example at the limit of its fix rounds. The Inbox then shows an item with the reason and the next step. The row of the task shows the button **Resume**. You can also write a comment on the task issue as a trusted user. Mobius then continues the task.
