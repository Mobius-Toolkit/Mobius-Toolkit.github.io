---
title: Install and first start
description: Install Mobius, connect GitHub, install a Harness, and merge the first pull request.
sidebar:
  order: 1
---

This guide takes you from a clean host to the first merged pull request. The full reference is [`docs/install.md`](https://github.com/Mobius-Toolkit/Mobius/blob/main/docs/install.md) in the Mobius repository.

## Requirements

Mobius runs on an Apple silicon Mac or on a Linux x86_64 server. Mobius is one program, and the web client is in the program.

Install these programs first:

- `git`
- `curl`
- `tar`
- `gh`, the GitHub CLI
- Node 22 or later, for the Claude Code adapter
- `whisper-server`, for voice input

To install `whisper-server` on macOS, run this command:

```sh
brew install whisper-cpp
```

At its first start, Mobius downloads two speech models to the folder `whisper/` in the data directory. They are about 1.5 GB and 470 MB. Until the download ends, voice input gives the message "The speech model is still downloading".

Mobius does not start when a Harness of your config, `gh` or `tar` is not on `PATH`.

## Install

1. Download the release archive for your host. The archive has one file: the program `mobius`.

   On an Apple silicon Mac:

   ```sh
   rm -rf ~/.mobius/app && mkdir -p ~/.mobius/app
   curl -fsSL https://github.com/Mobius-Toolkit/Mobius/releases/latest/download/mobius-aarch64-apple-darwin.tar.gz \
     | tar -xz -C ~/.mobius/app
   ```

   On Linux x86_64:

   ```sh
   rm -rf ~/.mobius/app && mkdir -p ~/.mobius/app
   curl -fsSL https://github.com/Mobius-Toolkit/Mobius/releases/latest/download/mobius-x86_64-unknown-linux-gnu.tar.gz \
     | tar -xz -C ~/.mobius/app
   ```

2. Add `~/.mobius/app` to `PATH` in your shell profile:

   ```sh
   export PATH="$HOME/.mobius/app:$PATH"
   ```

3. Make sure that the program starts:

   ```sh
   mobius --help
   ```

Use `curl`, not a browser. macOS blocks an unsigned program that a browser downloads. `curl` does not mark the file.

Your OS user must have write access to `~/.mobius/app`, because an upgrade replaces the program in that directory.

### Write the config file

Install a Harness first. See the section "Harnesses" below. Then run this command:

```sh
mobius init
```

The command asks for these values and writes `~/.mobius/config.toml`:

1. The access password of the web client, two times. It must have 8 characters or more. Use a password that you use nowhere else.
2. The GitHub logins of the trusted users. The agents act for these users.
3. The Harness and the model of each role. The command asks for the effort only when the Harness gives effort levels for that model.

`mobius init` writes only a new file. If the file exists, the command stops. Mobius reads the config file one time when it starts. Restart Mobius after each change of the file.

### Start the service

Run `mobius` in a terminal, as your own OS user:

```sh
mobius
```

On a server, run it in `tmux` or in your own service manager. Do not run Mobius as the root user. The Claude Code adapter refuses the full auto mode for root.

Caution: Workers run in full auto as your OS user and can read all your files.

The server listens on `127.0.0.1:6363`. To change the address, set `IP` and `PORT` before you start Mobius. `IP` must be `127.0.0.1` or `0.0.0.0`. To use another config path, set `MOBIUS_CONFIG`.

The session cookie of the web client is Secure. A browser keeps it only from an HTTPS address, and Chrome also keeps it from `http://localhost`. Thus use one of these ways:

- On a laptop, open `http://localhost:6363` in Chrome.
- On a server or on a phone, use Tailscale Serve. Install Tailscale on the server and on your devices. On the server, run `tailscale serve --bg 6363`. Then open `https://<host>.<tailnet>.ts.net`.

Do not open the port to the internet.

## First start in the web client

1. Open the web client, and log in with the access password.
2. On the page **Connect GitHub**, type your personal account or your organization in **Account or organization**.
3. Type the **App name**. GitHub App names are unique on all of GitHub. Use a name that no other App has, for example with your account name.
4. Click **Create the App**. GitHub shows the form of the new App. Create the App within one hour.
5. Click **Install `<App slug>` on your repositories**, and select the repositories. When you install the App, GitHub also authorizes you as a user of the App.

Mobius polls GitHub and finds these repositories. To add an organization later, use the form **Add an organization** on the same page.

Caution: the chat Lead acts on GitHub as you, through the Mobius App.

Protect the default branch of each repository. Then only a pull request can change it.

If the App has more than one repository in an organization, set the issue repository of the organization. It is the repository that holds the Workstream issues. Use the key `issue_repository` in `config.toml`, or select the repository on the page **Checkup**:

```toml
[organizations.Mobius-Toolkit]
issue_repository = "Mobius-Toolkit/Mobius"
```

## Harnesses

Install each Harness that you want to use, as your own OS user. Mobius needs only the Harnesses that your config uses.

Caution: read the terms of each Harness before you use it. The text in `docs/install.md` is not legal advice. You decide on the risk. You can bind a role to a different Harness. Read the terms in the section [Install and log in to the Harnesses](https://github.com/Mobius-Toolkit/Mobius/blob/main/docs/install.md#3-install-and-log-in-to-the-harnesses).

### Claude Code

1. Install Node 22 or later.
2. Install the adapter. The adapter includes its own Claude Code program.

   ```sh
   npm install -g @agentclientprotocol/claude-agent-acp
   ```

3. Install the `claude` CLI, and log in with `claude`. On a headless server, open the link on another device, and paste the code that the browser shows.

Do not use `claude setup-token` with `CLAUDE_CODE_OAUTH_TOKEN`. The token is then in the environment of Mobius.

The Lead and the Coordinator on Claude Code can use your Chrome through Claude in Chrome. Install Google Chrome and the Claude in Chrome extension, and log in to the extension with the same Claude account. Chrome must run when an agent uses the browser tools.

### Devin

1. Install Devin:

   ```sh
   curl -fsSL https://cli.devin.ai/install.sh | bash
   ```

2. Log in:

   ```sh
   devin auth login
   ```

   On a headless server, add `--force-manual-token-flow`, and paste the token.

### Antigravity

1. Download the `agy_acp_server` zip for your host from the [`antigravity-acp` entry of the ACP registry](https://github.com/agentclientprotocol/registry/tree/main/registry/antigravity-acp).
2. Put both files of the zip on `PATH`: the server as `agy_acp_server`, and `localharness_external` with its own name.
3. Log in with `mobius init`. `agy_acp_server` has no login command.

When Antigravity is not logged in, `mobius init` starts its Google login. Log in within 300 seconds.

Mobius also supports the Harnesses dsh and Codex. The install guide has their steps.

### Access check

Mobius checks each role at the start of the server and at each save of a role on the page **Roles**. It starts the Harness, sets the model and the effort, and sends one short prompt. If a check fails at the start, Mobius keeps running and holds the new sessions of that role. The Inbox shows the item "Access check failed" with the error text of the Harness.

## The first Workstream

A Workstream is a GitHub issue with the label `mobius:workstream`. Its title is the name, and its body is the Brief. The Brief states the goal, the scope and the limits of the work. A Lead agent runs each Workstream.

To create the first Workstream:

1. Open the **Chat** page. The Coordinator answers there.
2. Write what you want. For example, write the goal of a feature in one of your repositories.
3. The Coordinator drafts the title and the Brief of a Workstream. Mobius shows them to you. Click **Approve** to create the Workstream, or reject it and tell the Coordinator what to change.
4. Open the page **Workstreams**, and open the new Workstream. This opens the chat with its Lead.
5. Ask the Lead to create the task issues. A task issue is a GitHub issue in the repository of the code.

To start the first task, use one of these ways:

- Click the button **Start** on the task row in the Tasks tab of the Workstream. If a blocker of the task is open, the button reads "when unblocked", and Mobius starts the task after the blocker closes.
- Set Autopilot of the Workstream to **Start tasks**. Then Mobius starts each ready task. The guide "Autopilot and the global switches" describes the levels.

After the start, the flow is:

1. An Implementer works in its own worktree, runs the local check `.mobius/check` of the repository, and opens a pull request.
2. A Reviewer reviews the pull request. The Judge reads the review comments, and each fix round changes the code for them.
3. The Lead approves the pull request. Mobius makes the pull request ready for review, and the Inbox shows an item for you.
4. You review and merge the pull request. With Autopilot **Merge only** or **Start and merge**, Mobius merges after the Lead approves.

To see the work while it runs, open the page **Agents** for the Transcript of each agent.

## Upgrade

When a newer release exists, the sidebar shows the **Upgrade** button and the new version.

1. Click **Upgrade**. Mobius shows the changes of the new release.
2. Click **Upgrade** in the dialog. Mobius downloads the release and holds each new agent.
3. Wait. Mobius waits until no agent runs, and then it restarts with the new version. Mobius updates its database when it starts.

To stop the wait, click **Cancel upgrade**. Mobius then keeps the current version. If the upgrade fails, the sidebar shows the error and Mobius keeps the current version.

To upgrade by hand:

1. Stop Mobius.
2. Run the `rm` and `curl` lines of the section "Install" again.
3. Start Mobius.

To make a backup, stop Mobius and copy `~/.mobius`. While Mobius runs, you can use `sqlite3 ~/.mobius/mobius.db ".backup <backup file>"`.
