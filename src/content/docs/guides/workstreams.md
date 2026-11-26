---
title: Workstreams, Projects and tasks
description: Learn how a goal becomes a Workstream, task issues, pull requests and a merge, and what you do at each step.
sidebar:
  order: 2
---

This guide shows how work moves through Mobius. It also shows what you do at each step. Install Mobius first. See the guide "Install and first start".

## The flow

```
Goal ──> Coordinator ──> Workstream (Brief) ──> Lead
                                                  │
                                   Projects and task issues
                                                  │
              Implementer ──> draft pull request ──> Reviewer
                                                  │
                                 fix rounds and CI ──> Lead approval
                                                  │
                                       merge queue ──> merge
```

You decide at four points:

- You approve the Brief of a new Workstream.
- You approve some actions of the Lead.
- You start a task, or Autopilot starts it for you.
- You merge a pull request, or Autopilot merges it for you.

The guide "Autopilot and the global switches" describes Autopilot.

## Create a Workstream

A Workstream is a GitHub issue with the label `mobius:workstream`. Its title is the name. Its body is the Brief. The Brief states the goal, the scope and the limits of the work. One Lead agent runs each Workstream.

The Coordinator is the agent that you talk to on the page **Chat**. It helps you put work into Workstreams.

1. Open the page **Chat**.
2. Write what you want. For example, write the goal of a feature.
3. The Coordinator drafts a title and a Brief. It sends them to Mobius. Mobius does not create the Workstream yet.
4. Open the page **Inbox**. The Workstream waits there as a request for approval.
5. Click **Answer** on the row. The dialog shows the full Brief.
6. Click **Approve** to create the Workstream. Click **Reject** to refuse it. The Coordinator reads your message and changes the plan.

Mobius creates the Workstream issue in the issue repository of the organization. The install guide describes the key `issue_repository`.

The Coordinator adds the label `mobius:evergreen` or `mobius:maintenance` only when you ask for it. A Workstream with `mobius:evergreen` has no end.

The Coordinator can also do these things:

- It moves an open issue into a Workstream. Give it the number of the issue.
- It sends a message to the Lead of a Workstream. For example, it asks the Lead to create task issues. You approve the message first.
- It starts a Researcher that answers a question about the code.
- It sends a request to the Curator that keeps the memory files of a repository. You approve the request first.

## The Lead chat

Open the page **Workstreams**, and open a Workstream. This opens the chat with its Lead. The header shows the button **Brief** and the Autopilot menu. The panel on the right has four tabs: **Tasks**, **Agents**, **Details** and **Recurring**.

The Lead reads the Brief, plans the task issues, and follows each task until its pull request merges. After the creation of the Workstream, the Lead plans the first issues from the Brief.

### Events

Mobius sends events to the Lead. The chat shows each event as a muted entry. Some events are:

- the dispatch of a task
- a comment on a task issue
- an Implementer that cannot do its task
- a task that stops
- a pull request that is ready for the approval of the Lead
- a CI run that takes a long time
- a change of Autopilot or of the Brief
- a recurring task

The Lead answers an event with a tool call. The reply text of an event turn does not go to the chat. When the Lead has a result for you, it adds a message to the chat. This message adds no item to the Inbox.

Your message comes before each queued event. Thus you can talk to the Lead while it works.

### Questions

When the Lead needs a decision, it asks a question. Mobius posts the question as a comment on the task issue, or on the Workstream issue. Mobius adds the label `mobius:question` and an item to the Inbox.

You can answer in the Inbox, in the chat or on GitHub. The answer goes back to the Lead as an event. The Lead then updates the task issue and continues.

### Actions that wait for your approval

These actions do not run at once. Mobius shows the exact arguments to you in the Inbox. The action runs after you click **Approve**:

- create a Workstream
- move a task to a different Workstream
- send a message to the Lead of a different Workstream
- change the Brief
- add, change or delete a recurring task

Other actions of the Lead run at once. Examples are the creation of a task issue, the creation of a Project, and the approval of a pull request.

The Lead does not merge pull requests. It does not run tests or builds. It reads the results of the CI and of the local check.

When facts show that the Brief is wrong, the Lead proposes a new Brief. After you approve it, the Lead compares each open task issue with the new Brief.

## Projects

A Project is an independent piece of work of a Workstream. It has its own goal. It is a GitHub issue with the label `mobius:project`. Its body has the sections Goal, Scope and Done.

The Brief holds only the context that is true for all Projects. A new piece of work needs a new Project and no change of the Brief.

- Ask the Lead for a new piece of work. The Lead creates the Project at once.
- A task issue can be in a Project, or directly below the Workstream issue. The Lead moves a task issue between Projects when you ask.
- When each item of the Done list is on the main branch, the Lead closes the Project with a report. The Lead cannot close a Project that has an open task issue or a recurring task.
- An evergreen Project has no end. The Lead creates it only when you ask for it. The Lead never closes it.

Autopilot does not start a Project. It starts the task issues below the Project.

### Evergreen Workstreams

A Workstream that is not evergreen is finished when all its tasks are closed and each item of the Done list of the Brief is on the main branch. The Lead reports it as finished. If a todo is open, the Lead names it and asks you to complete or dismiss it first. Then click **Close Workstream** in the chat.

An evergreen Workstream is never finished. Its Projects close when their work is done, and the Workstream stays open. The Workstreams page marks it with **Evergreen**.

Mobius has two special evergreen Workstreams:

- The maintenance Workstream (`mobius:maintenance`). It gets the task issues of the Curator and the reports of CI failures.
- The Skills Workstream (`mobius:skills`). It gets the proposals for the skills of the agents.

## Task issues

A task issue is a GitHub issue in the repository of the code. It is a sub-issue of the Workstream issue or of a Project. One task gives one pull request. The Lead splits work that has independent parts into more issues.

The title is a short imperative sentence. The body has these sections, in this order:

| Section | Content |
| --- | --- |
| Goal | What the task must do |
| Today | The state of the code now. This section is optional. |
| Change | What to change. For an API, a table, a tool or a config key, the Lead gives the names and the forms that other code uses. |
| Limits | What the task must not do |
| Done | The items that the pull request must meet |

The Implementer sees only the Brief, the task issue and the instructions of the Lead. Thus each requirement must be in the issue body. When an answer or a comment changes a requirement, the Lead updates the body.

### Blockers

When a task needs another issue first, the Lead sets that issue as a blocker. A blocker is a GitHub issue dependency. It can be in another repository or in another Workstream.

A task with an open blocker does not start. In the tab **Tasks**, the button reads "Start #N when unblocked". Mobius starts the task after the blocker closes. If the blockers form a cycle, the Lead gets an event and removes the wrong blocker.

### Labels

Mobius writes these labels on the issues. Do not set the state labels by hand.

| Label | Description |
| --- | --- |
| `mobius:ready` | A request to start the task |
| `mobius:working` | A Mobius agent works on the task |
| `mobius:review` | The pull request waits for a human review |
| `mobius:needs-human` | The task stopped and needs a human |
| `mobius:question` | Mobius waits for an answer from a human |
| `mobius:triage` | You must accept the task before Mobius can start it |
| `mobius:workstream` | The issue is a Workstream |
| `mobius:project` | The issue is a Project |
| `mobius:evergreen` | The Workstream has no end |

The labels `mobius:autopilot` and `mobius:auto-merge` store the Autopilot level of a Workstream.

### Start a task

Use one of these ways:

- Click the button **Start** on the task row in the tab **Tasks**.
- Add the label `mobius:ready` to the issue on GitHub.
- Set Autopilot of the Workstream to **Start tasks**. Then Mobius starts each ready task.

A task that is queued waits for a free Autopilot slot. A global switch can hold the start of all tasks.

## A task from the start to the merge

```
dispatch ──> Implementer ──> local check ──> draft pull request
                                                   │
        ┌──────────────── Reviewer, Judge ─────────┤
        │                                          │
   fix round <── findings, CI failure              CI passes
                                                   │
                                  Lead approval ──> merge queue ──> merge
```

### 1. The Implementer

After the start, Mobius dispatches the task. The Lead gets an event. It compares the task issue with the Brief and with the code on the main branch.

- When only facts are old, the Lead updates the issue body.
- When a requirement disagrees with the Brief or the code, the Lead asks you.
- Else the Lead starts an Implementer with its instructions.

The Implementer works in its own git worktree on the branch of the task. It changes the code and commits. It does not push. Its last step is a report. Mobius writes the report in the description of the pull request.

### 2. The local check

When the Implementer ends, Mobius runs the script `.mobius/check` of the repository on the head commit. At most `max_checks` local checks run at the same time. Other tasks wait for a free place. A check that is too slow fails after `check_timeout`.

When the check fails, the Implementer gets the output and fixes the code. A round allows up to `max_check_attempts` failed checks. The default is 3. After the last failed check, Mobius pushes the work and stops the task. See the section "Stop of a task".

### 3. The draft pull request

When the check passes, Mobius pushes the commits. It opens a draft pull request. The pull request stays a draft until the Lead approves it.

### 4. The review

The Reviewer starts only after `.mobius/check` passes on the head. It reads the full diff and compares it with the task issue and with the report of the Implementer. It does not run tests or change code.

The Reviewer posts one GitHub review with one comment for each finding. Each finding is a fix or a follow-up:

- A fix is a defect that the diff causes, or a requirement that the pull request does not meet. It goes to a fix round.
- A follow-up is a defect that was there before the diff, or work outside the task. It goes to the Lead.

The Reviewer also reports the deployment needs of the diff. See the section "The Inbox and the todos".

You can also comment on the pull request on GitHub. Mobius reads the comments of trusted users and of trusted bots. It adds the reaction "eyes" when it gets a comment. It adds the reaction "rocket" when an agent starts to work on it.

### 5. The fix rounds

The Judge reads each new review thread and each conversation comment. It gives each one or more actions:

| Action | Description |
| --- | --- |
| `fix` | The comment asks for a change of the code. |
| `question` | The comment asks a question. |
| `follow-up` | The comment asks for work outside the pull request. |
| `reject` | The comment of a bot is wrong. |

The Judge starts after the reviews of the pull request stay the same for `review_quiet_period`. The default is 10 minutes.

In a fix round, the Implementer gets the open items. For a `fix`, it changes the code, commits, and replies with the SHA of the commit. For a `question`, it replies with the answer. If it does not agree, it replies with the reason. Mobius resolves each thread after the reply.

For each follow-up, the Lead chooses one of three actions: it creates a new issue, it adds the work to the current task, or it rejects the follow-up with a reason.

A fix round counts toward `max_fix_rounds`. The default is 10. A round with no `fix` action does not count.

### 6. The CI

After each push, the task waits for the CI of GitHub. If a CI job fails, the Diagnoser reads the log of the job. The fix round gets the reason of the failure.

If the failure is not in the code, for example a network error, the Lead runs the failed jobs again. If the pull request has a merge conflict, Mobius starts a conflict round. A pull request with a conflict that is older than `stale_pr_age` gets no conflict round. The Lead then proposes that a human closes it.

### 7. The Lead approval

When the CI passes and no finding is open, the pull request is ready for the Lead. If the Reviewer found no problem and each check passed, Mobius approves the head itself. The Lead reads the pull request in other cases. For example, a follow-up or a check run that asks for a person, such as changed screenshots.

The Lead does one of two things:

- It approves the pull request. It writes a report with two parts: what it checked, and what it verified and how. Mobius posts the report as a comment, makes the pull request ready for review, and adds an item to your Inbox.
- It sends its findings to a fix round.

The pull request stays a draft while a todo that blocks the merge is open.

### 8. The merge

Without a merge level of Autopilot, you merge. The item "ready for review" in the Inbox has the buttons **Merge** and **Open PR**.

With the level **Merge only** or **Start and merge**, the approved pull request enters the merge queue of its repository. The head of the queue merges at its turn:

1. If newer commits on the default branch change a file of the pull request, Mobius updates the branch.
2. The queue waits for the CI and for the approval again.
3. The queue merges the pull request.

If the head stays in checks or in approval for more than 2 hours and another task waits, Mobius removes it from the queue. The Lead finds the cause.

After the merge, the task ends. The Lead tells you the result in the chat.

## Stop of a task

Mobius stops a task and gives it to you when it cannot continue. Some causes are:

- The task reached `max_fix_rounds`.
- A Worker failed more times than `max_worker_restarts`.
- The check failed more times than `max_check_attempts`.

Mobius sets the label `mobius:needs-human`. The Inbox shows an item with the buttons **Resume** and **Open GitHub**. The Lead gets an event. It reads the reason and the failed checks, then it does one of two things:

- If it can remove the cause, it writes the exact fix in the Done list of the issue. Then it continues the task.
- If it cannot, it asks you for the next step.

To continue a task yourself, click **Resume** in the Inbox or in the tab **Tasks**. A stopped task also continues when its CI passes on the head, or when its pull request has a merge conflict.

To stop a task that runs, click the stop button of its row in the tab **Tasks**. The pull request and the branch stay.

If Mobius loses the state of a task, the Inbox shows the item "lost" with the button **Start again**.

## The Inbox and the todos

The page **Inbox** lists each item that waits for you. It shows "Nothing waits for you." when it has none. Each row has a **Chat** button. It opens the chat with the agent that owns the item.

| Item | Your action |
| --- | --- |
| A question of an agent | Click **Answer**, and write the answer. |
| An action that waits for approval | Click **Answer**, then **Approve** or **Reject**. |
| A pull request that is ready for review | Click **Merge**, or click **Open PR**. |
| A task that stopped | Click **Resume**. |
| A task that is lost | Click **Start again**. |
| A Lead that failed | Click **Send again** or **Dismiss**. |
| An action of the Owner | Do the action, then click **Done**. |
| A todo | Click **Complete todos**. |
| An access check that failed | Fix the login of the Harness. |

### Todos

A todo is a deployment need. It is a change that a person must do in the deployment of the merged code. The Reviewer reports each need from the full diff. Examples are a new environment variable, a config value, a secret, an external credential, a manual step and a new external service. The todo gives the name of the need and never its value.

Each todo has one of these marks:

- **Mandatory.** The deployment fails without it. It blocks the merge until you complete it.
- **Optional.** The application works without it. It blocks the merge until you complete it or dismiss it.
- **After merge.** You can do the step only after the merge. It does not block the merge.

The row of the pull request shows the button **Complete todos (N)**. It opens the list "Todos of PR #N". Each todo shows its reason and its place in the code. While a todo blocks the merge, the pull request stays a draft and the row has no **Merge** button. A Workstream with an open todo does not finish.

### Actions of the Owner

An action of the Owner is different from a todo. It is a step outside the code that the next round needs now. An example is an expired login of a CLI on the Mobius server. The Reviewer or the Lead marks the action. Mobius pauses the task and adds an item with the button **Done**. After you click **Done**, Mobius starts the next step.

## Triage

An issue that is in no Workstream gets no action from Mobius. If you comment on it, Mobius replies that the issue is in no Workstream.

To start the triage of such an issue, add the label `mobius:triage`. A trusted user must add it. Then the Triager starts.

1. The Triager and you discuss the wanted outcome in the comments of the issue. Mobius posts the last message of each turn of the Triager as a comment. Each comment of a trusted user starts the next turn.
2. The Triager proposes one of two results: a new Workstream with its title and its full Brief, or a message to the Lead of an open Workstream.
3. When you agree, the Triager calls the tool with the exact text.
4. You approve the action in the Inbox.
5. Mobius closes the issue with a comment that links to the Workstream.

If you reject the action, or it fails, Mobius posts a comment on the issue. The comment starts the next turn of the Triager. The Triager can also start a Researcher. Its report arrives as a comment.

The label `mobius:triage` has a second use. A task issue with this label waits for you. For example, the Curator creates its task issues with it. To accept the task and start it, click **Start** in the tab **Tasks**. To accept it with no start, ask the Lead to accept it.

## Recurring tasks

A recurring task is work that the Lead does at a set time. Ask the Lead in the chat to add one. Give the time and the work. For example, you can ask for a weekly check every Monday at 09:00.

1. The Lead writes a cron expression with five fields. For Monday at 09:00, it writes `0 9 * * 1`. The server uses its local time zone.
2. You approve the action in the Inbox.
3. At each time, the Lead gets an event with the text of the task. It does the work. For example, it starts a Researcher, creates a task issue, or tells you a result.

A recurring task can belong to a Project. Then the Lead creates the issues of each run below that Project.

Open the tab **Recurring** to see the tasks. Each task shows its text and its schedule. Open a task to see the history of its runs. The buttons are:

- **Pause** and **Resume**
- **Run now**, to start a run at once
- **Delete**, which also deletes the history

To change the time or the text, ask the Lead. You approve each change.
