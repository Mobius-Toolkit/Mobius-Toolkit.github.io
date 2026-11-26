---
title: Configuration
description: Each key of the Mobius config file, with its type, default value, unit and meaning.
sidebar:
  order: 1
---

This page lists each key of the Mobius config file. The source is `internal/config/config.go` in the [Mobius repository](https://github.com/Mobius-Toolkit/Mobius).

## The file

The config file is a TOML file. The default path is `~/.mobius/config.toml`. To use another path, set `MOBIUS_CONFIG` before you start Mobius.

`mobius init` writes a new file. See the guide [Install and first start](/guides/install/).

Mobius reads the file one time, when it starts. Restart Mobius after each change of the file.

Mobius does not start in these cases:

- The file has an unknown key. The error text gives the line and the name of the key.
- A key has an incorrect value.
- A key that Mobius needs is missing.

## Top-level keys

These keys are at the top of the file, before the first table header.

| Key | Type | Default | Unit | Meaning |
| --- | --- | --- | --- | --- |
| `access_password` | string | none | | The password of the web client. It must have 8 characters or more. The key is necessary. |
| `trusted_users` | array of strings | none | | The GitHub logins of the users that the agents act for. The array must not be empty. The key is necessary. |
| `trusted_bots` | array of strings | `[]` | | The GitHub logins of bots that Mobius trusts, as it trusts the trusted users. |
| `data_dir` | string | `~/.mobius` | path | The directory of `mobius.db`, of the log files and of the work directories of the agents. |
| `ui_url` | string | `""` | | The public address of the web client. It must be an absolute `http` or `https` address. Mobius removes a `/` at the end. With no `ui_url`, Mobius adds no link to the pull requests and the task issues that it creates. |
| `max_checks` | integer | `1` | checks | The maximum number of local checks that run at the same time. |
| `max_fix_rounds` | integer | `10` | rounds | The maximum number of fix rounds of a task. |
| `max_check_attempts` | integer | `3` | attempts | The maximum number of failed local checks in one Implementer round. |
| `max_worker_restarts` | integer | `3` | restarts | The maximum number of restarts of a failed Worker. After the last restart, the task goes to a human. |
| `check_timeout` | duration string | `"15m"` | time | The time limit of one local check, and of one script `.mobius/init`. |
| `review_quiet_period` | duration string | `"10m"` | time | The Judge starts when the reviews of a pull request have no change for this time. |
| `stale_pr_age` | duration string | `"168h"` | time | A pull request with a conflict that is older than this time gets no conflict round. |
| `lead_idle_timeout` | duration string | `"50m"` | time | A Lead session with no new message or event ends after this time. |
| `poll_interval` | duration string | `"30s"` | time | The time between two polls of GitHub. |
| `housekeeper_interval` | duration string | `"1h"` | time | The time between two runs of the Housekeeper. |

A duration is a text with a number and a unit for each part. The units are `s`, `m` and `h`. For example, write `"90s"`, `"1h30m"` or `"168h"`. Mobius does not accept a day unit or a space.

Mobius writes each log line to the standard error and to the file `<data_dir>/logs/mobius.log`.

## Table `roles`

The table `roles` has one subtable for each Role. The subtable names are `lead`, `coordinator`, `triager`, `implementer`, `researcher`, `reviewer`, `judge`, `curator`, `diagnoser` and `operator`. For example, the subtable of the Lead is `[roles.lead]`.

Each subtable has the same keys:

| Key | Type | Default | Unit | Meaning |
| --- | --- | --- | --- | --- |
| `harness` | string | none | | The agent program of the Role: `claude-code`, `antigravity`, `devin`, `dsh` or `codex`. The key is necessary. |
| `model` | string | none | | The model that the Harness uses for the Role. It must not be empty. The key is necessary. |
| `effort` | string | `""` | | The effort level. With no value, the Harness uses its own default effort. |
| `context` | integer | `0` | tokens | The largest context of a session of the Role. The value is from `100000` to `1000000`. `0` means no limit. Only `claude-code` has a context limit. |
| `max` | integer | see below | sessions | The maximum number of agents of the Role that run at the same time. |

The default of `max` is different for each Role:

| Role | Default `max` |
| --- | --- |
| `lead` | `8` |
| `coordinator` | `4` |
| `triager` | `12` |
| `implementer` | `2` |
| `researcher` | `2` |
| `reviewer` | `2` |
| `judge` | `2` |
| `curator` | `2` |
| `diagnoser` | `2` |
| `operator` | `2` |

The Role `operator` is optional. With no `harness`, no `model` and no `effort`, the Operator uses `claude-code`, the model `opus` and the effort `medium`. When you set one of these keys, set the `harness` and the `model` also.

## Table `organizations`

The table `organizations` has one subtable for each GitHub organization. The name of the subtable is the name of the organization. For example, the subtable of `Mobius-Toolkit` is `[organizations.Mobius-Toolkit]`.

| Key | Type | Default | Unit | Meaning |
| --- | --- | --- | --- | --- |
| `issue_repository` | string | none | | The repository that holds the Workstream issues of the organization, as `owner/name`. The owner must be the organization. The key is necessary when the subtable exists. |

Set the key when the Mobius App has more than one repository in the organization. Each task issue stays in the repository of its code.

## Example

This file has the keys that the install guide sets. `mobius init` writes the first three keys. The table `organizations` is optional.

```toml
access_password = "a password with 8 or more characters"
trusted_users = ["your-github-login"]

[roles.lead]
harness = "claude-code"
model = "opus"
effort = "high"

# Write the same keys for each other Role:
# coordinator, triager, implementer, researcher,
# reviewer, judge, curator and diagnoser.

[organizations.Mobius-Toolkit]
issue_repository = "Mobius-Toolkit/Mobius"
```

## Settings that are not in the file

The web client holds some settings. Mobius keeps them in its database, not in the config file.

- **Roles**: the page **Roles** sets the `harness`, the `model`, the `effort`, the `context` and the `max` of each Role. A value from the page replaces the value of the config file for the next session of the Role. A session that runs keeps its values. A value that is equal to the config file is not stored. To use the config file again, reset the Role on the page. See the guide [Roles and Harness settings](/guides/roles/).
- **Autopilot** and the global switches: the levels of Autopilot and the other switches are set in the web client. See the guide [Autopilot and the global switches](/guides/autopilot/).
- **Issue repository**: the page **Checkup** can also set the issue repository of an organization. This does not work when the config file sets `issue_repository` for that organization. Change the key in the config file in that case.
