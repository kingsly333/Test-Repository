// GH-900 (GitHub Foundations) question bank (32 items), written once (Rule 8).
// Source of truth: "Study guide for Exam GH-900: GitHub Foundations", Microsoft Learn, skills measured as of
// January 2026 (fetched 2026-10-07). Each question names the official skill line it tests and links the
// GitHub Docs page on that topic (all links returned HTTP 200 on 2026-10-07) (Rule 5).
// Questions are original. Domain mix follows the blueprint midpoints: basics 27.5%, repos / collaborate /
// modern / security 12.5% each, projects / community 7.5% each.

import type { Question } from "./questions";

const G = "https://docs.github.com/en/";
const DOC = {
  git: { label: "About Git", url: G + "get-started/using-git/about-git" },
  gitgh: { label: "About GitHub and Git", url: G + "get-started/start-your-journey/about-github-and-git" },
  flow: { label: "GitHub flow", url: G + "get-started/using-github/github-flow" },
  markdown: { label: "Writing and formatting on GitHub", url: G + "get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/about-writing-and-formatting-on-github" },
  accounts: { label: "Types of GitHub accounts", url: G + "get-started/learning-about-github/types-of-github-accounts" },
  desktop: { label: "GitHub Desktop documentation", url: G + "desktop" },
  security: { label: "Adding a security policy to your repository", url: G + "code-security/getting-started/adding-a-security-policy-to-your-repository" },
  template: { label: "Creating a template repository", url: G + "repositories/creating-and-managing-repositories/creating-a-template-repository" },
  depgraph: { label: "About the dependency graph", url: G + "code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph" },
  repos: { label: "About repositories", url: G + "repositories/creating-and-managing-repositories/about-repositories" },
  linkpr: { label: "Linking a pull request to an issue", url: G + "issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue" },
  discussions: { label: "About discussions", url: G + "discussions/collaborating-with-your-community-using-discussions/about-discussions" },
  pages: { label: "What is GitHub Pages?", url: G + "pages/getting-started-with-github-pages/what-is-github-pages" },
  notifications: { label: "Configuring notifications", url: G + "account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications" },
  actions: { label: "Understanding GitHub Actions", url: G + "actions/get-started/understanding-github-actions" },
  copilot: { label: "GitHub Copilot plans", url: G + "copilot/get-started/plans" },
  codespaces: { label: "Codespaces overview", url: G + "codespaces/overview" },
  devcontainers: { label: "Introduction to dev containers", url: G + "codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers" },
  githubdev: { label: "The github.dev web-based editor", url: G + "codespaces/the-githubdev-web-based-editor" },
  projects: { label: "About Projects", url: G + "issues/planning-and-tracking-with-projects/learning-about-projects/about-projects" },
  labels: { label: "Managing labels", url: G + "issues/using-labels-and-milestones-to-track-work/managing-labels" },
  passkeys: { label: "About passkeys", url: G + "authentication/authenticating-with-a-passkey/about-passkeys" },
  tfa: { label: "About two-factor authentication", url: G + "authentication/securing-your-account-with-two-factor-authentication-2fa/about-two-factor-authentication" },
  roles: { label: "Repository roles for an organization", url: G + "organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization" },
  protected: { label: "About protected branches", url: G + "repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" },
  emu: { label: "About Enterprise Managed Users", url: G + "enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/about-enterprise-managed-users" },
  sponsors: { label: "About GitHub Sponsors", url: G + "sponsors/getting-started-with-github-sponsors/about-github-sponsors" },
  forks: { label: "About forks", url: G + "pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks" },
};

type Doc = (typeof DOC)[keyof typeof DOC];
type Dom = "basics" | "repos" | "collab" | "modern" | "projects" | "security" | "community";

function g(
  id: string,
  domainId: Dom,
  skill: string,
  doc: Doc,
  prompt: string,
  choices: string[],
  answer: number | number[],
  explanation: string,
): Question {
  return {
    id: `gh900-${id}`,
    topicId: "github",
    domainId,
    skill,
    prompt,
    choices,
    answer: Array.isArray(answer) ? answer : [answer],
    explanation,
    source: { label: `GH-900 Study Guide (as of January 2026): ${skill} · ${doc.label}`, url: doc.url },
  };
}

export const GH900_QUESTIONS: Question[] = [
  // ======== Understand Git and GitHub basics (10) ========
  g("basics-1", "basics", "Describe the purpose and benefits of version control", DOC.git,
    "Which is a core benefit of using version control on a team project?",
    ["It records the history of changes so you can review, compare and revert them.", "It removes the need for code review.", "It makes files smaller on disk.", "It automatically fixes merge conflicts."], 0,
    "Version control keeps a history of changes, supports collaboration, and lets you restore earlier states. It does not replace review or fix conflicts for you."),

  g("basics-2", "basics", "Explain the difference between Git and GitHub", DOC.gitgh,
    "Which statement correctly distinguishes Git from GitHub?",
    ["Git is a hosting platform; GitHub is a command-line tool.", "Git is a distributed version control system; GitHub is a platform that hosts Git repositories and adds collaboration features.", "They are two names for the same product.", "GitHub is required to use Git."], 1,
    "Git is the version control software; GitHub is a service built around Git repositories, adding pull requests, issues, Actions and more. You can use Git without GitHub."),

  g("basics-3", "basics", "Identify key Git concepts such as repositories, commits, and branches", DOC.git,
    "What is a Git commit?",
    ["A copy of the whole internet.", "A saved snapshot of changes with a message and author.", "A remote server.", "A request to merge a branch."], 1,
    "A commit records a snapshot of the staged changes along with a message, author and a reference to its parent commit."),

  g("basics-4", "basics", "Identify key Git concepts such as repositories, commits, and branches", DOC.git,
    "Why would you create a branch?",
    ["To make a separate line of work so changes stay isolated until ready.", "To delete history.", "To rename the repository.", "To invite collaborators."], 0,
    "Branches let you develop features or fixes in isolation from the main line of work, then merge them when ready."),

  g("basics-5", "basics", "Explain the GitHub Flow for collaboration", DOC.flow,
    "Which order describes GitHub flow?",
    [
      "Merge, then branch, then open a pull request.",
      "Create a branch, make commits, open a pull request, review, merge.",
      "Open a pull request, then create a branch, then commit.",
      "Commit directly to main, then open an issue.",
    ], 1,
    "GitHub flow is a lightweight branch-based workflow: branch, change, open a pull request, get review, then merge."),

  g("basics-6", "basics", "Identify uses of Markdown for clear communication in issues and pull requests", DOC.markdown,
    "Which Markdown creates a task list item in an issue?",
    ["- [ ] Write tests", "* Write tests *", "# [x] Write tests", "<task>Write tests</task>"], 0,
    "A hyphen followed by [ ] creates an unchecked task item (use [x] for checked). Task lists show progress in issues and pull requests."),

  g("basics-7", "basics", "Describe GitHub accounts, organizations, and enterprise options", DOC.accounts,
    "A company wants shared ownership of repositories with teams and role-based access. Which account type fits?",
    ["A personal account for each repository", "An organization", "A gist", "A fork"], 1,
    "Organizations are shared accounts where teams can collaborate across many repositories with granular access control."),

  g("basics-8", "basics", "Recognize when to use GitHub Desktop and GitHub Mobile", DOC.desktop,
    "Which user is the best fit for GitHub Desktop?",
    ["Someone who prefers a graphical app to run common Git workflows instead of the command line.", "Someone who wants to run CI pipelines.", "Someone who wants to host a website.", "Someone who wants to manage billing."], 0,
    "GitHub Desktop is a graphical client for common Git and GitHub tasks such as cloning, committing and pushing."),

  g("basics-9", "basics", "Identify key Git concepts such as repositories, commits, and branches", DOC.git,
    "You edited a file locally and want to record the change in your local repository. Which sequence does this?",
    ["git push, then git pull", "git add, then git commit", "git clone, then git fork", "git branch, then git delete"], 1,
    "git add stages the change and git commit records it. Pushing sends commits to a remote afterwards."),

  g("basics-10", "basics", "Identify key Git concepts such as repositories, commits, and branches", DOC.git,
    "Which command downloads new commits from the remote and integrates them into your current branch?",
    ["git push", "git pull", "git init", "git stash"], 1,
    "git pull fetches remote changes and merges them into the current branch; git push does the reverse, sending your commits to the remote."),

  // ======== Work with GitHub repositories (4) ========
  g("repos-1", "repos", "Describe the structure and key files of a GitHub repository", DOC.security,
    "Which file tells people how to report a vulnerability responsibly?",
    ["README.md", "LICENSE", "SECURITY.md", "CONTRIBUTING.md"], 2,
    "A SECURITY.md file defines the security policy, including how to report vulnerabilities. README describes the project; LICENSE sets terms of use; CONTRIBUTING explains how to contribute."),

  g("repos-2", "repos", "Identify how to create, organize, and maintain repositories using templates and branches", DOC.template,
    "You want new projects to start with the same files and folder structure. What should you use?",
    ["A fork of the original", "A template repository", "A gist", "A wiki"], 1,
    "A template repository lets people generate new repositories with the same directory structure and files."),

  g("repos-3", "repos", "Describe repository insights, stars, feature previews, repository metrics dashboards, and dependency insights for improved visibility", DOC.depgraph,
    "Which repository feature shows the packages your project depends on?",
    ["The dependency graph", "Projects", "Discussions", "GitHub Pages"], 0,
    "The dependency graph lists the ecosystems and packages a repository depends on, giving dependency insight."),

  g("repos-4", "repos", "Recognize best practices for repository maintenance and collaboration", DOC.repos,
    "Which repository visibility limits access to people you explicitly grant access to?",
    ["Public", "Private", "Template", "Archived"], 1,
    "Private repositories are visible only to the owner and people they grant access to; public repositories are visible to everyone."),

  // ======== Collaborate using GitHub (4) ========
  g("collab-1", "collab", "Explain how to link pull requests to issues and manage templates, filters, and assignments", DOC.linkpr,
    "How can a pull request automatically close issue #42 when it is merged into the default branch?",
    ["Add a closing keyword such as \"Closes #42\" in the pull request description.", "Rename the branch to 42.", "Add a label called closed.", "Assign the issue to yourself."], 0,
    "Closing keywords (such as closes, fixes or resolves) followed by the issue reference link the pull request and close the issue on merge to the default branch."),

  g("collab-2", "collab", "Describe how to use issues, pull requests, and discussions for collaboration", DOC.discussions,
    "When are GitHub Discussions a better fit than Issues?",
    ["For open-ended conversation and questions that are not a specific piece of actionable work.", "For tracking a specific bug with an assignee.", "For storing build artifacts.", "For hosting a static website."], 0,
    "Discussions suit community Q&A and open-ended conversation; issues track actionable work such as bugs and tasks."),

  g("collab-3", "collab", "Describe how to use Gists, Wikis, and GitHub Pages to document and share information", DOC.pages,
    "Which feature publishes a static website directly from a repository?",
    ["GitHub Pages", "Gists", "Projects", "Discussions"], 0,
    "GitHub Pages hosts static sites straight from a repository. Gists share snippets and wikis hold project documentation."),

  g("collab-4", "collab", "Identify the purpose of notifications and how to configure them for workflow management", DOC.notifications,
    "You are no longer interested in a thread but keep getting notifications. What should you do?",
    ["Unsubscribe from the thread.", "Delete your account.", "Fork the repository.", "Archive the repository."], 0,
    "Unsubscribing from a conversation stops notifications for it. You can also tune notification settings globally."),

  // ======== Apply modern development practices (4) ========
  g("modern-1", "modern", "Describe the purpose and capabilities of GitHub Actions", DOC.actions,
    "Where are GitHub Actions workflows defined, and what triggers them?",
    ["YAML files in .github/workflows, triggered by events such as pushes or pull requests.", "JSON files in the repository root, run manually only.", "The repository wiki, triggered by comments.", "The Marketplace, triggered by stars."], 0,
    "Workflows are YAML files stored in .github/workflows and run in response to events, on a schedule, or manually."),

  g("modern-2", "modern", "Explain the differences between GitHub Copilot for Individuals, Business, and Enterprise", DOC.copilot,
    "A freelancer wants Copilot for personal use with no organization involved. Which kind of plan fits?",
    ["An individual plan", "Copilot Business", "Copilot Enterprise", "A plan managed by an Enterprise Managed Users account"], 0,
    "Individual plans are for personal accounts, while Business and Enterprise plans are managed through an organization or enterprise with central policy controls."),

  g("modern-3", "modern", "Describe GitHub Codespaces and how to set up, customize, and use dev containers", DOC.devcontainers,
    "How do you customise the environment that a Codespace uses for a repository?",
    ["Add a dev container configuration (devcontainer.json) to the repository.", "Edit the repository's LICENSE.", "Create a gist.", "Change the default branch name."], 0,
    "A dev container configuration in the repository defines the tools, extensions and settings used when a codespace is created."),

  g("modern-4", "modern", "Explain when to use the github.dev editor and how it differs from Codespaces", DOC.githubdev,
    "How does github.dev differ from a Codespace?",
    ["github.dev is a lightweight web editor for quick edits, with no terminal or compute to run code; a Codespace is a full cloud development environment.", "github.dev is a full cloud VM; a Codespace is a text editor.", "They are identical.", "github.dev only works offline."], 0,
    "github.dev is a browser-based editor opened with the period key for quick edits. It has no terminal or ability to run code; Codespaces provide a full configurable environment."),

  // ======== Manage projects with GitHub (3) ========
  g("projects-1", "projects", "Describe GitHub Projects and layout options", DOC.projects,
    "Which are layout options for a GitHub Project?",
    ["Table, Board and Roadmap", "Mind map, Pie and Radar", "Wiki, Gist and Page", "Fork, Clone and Pull"], 0,
    "Projects can be viewed as a table, a board (kanban) or a roadmap."),

  g("projects-2", "projects", "Explain how to configure projects, labels, milestones, and workflows", DOC.labels,
    "You want to categorise issues by type, such as bug or enhancement, and filter by them. What do you use?",
    ["Labels", "Gists", "Forks", "Sponsors"], 0,
    "Labels categorise issues and pull requests and can be used to filter and search."),

  g("projects-3", "projects", "Explain how to configure projects, labels, milestones, and workflows", DOC.projects,
    "You want an item's Status in a project to change automatically when its issue is closed. What helps?",
    ["A built-in project workflow", "A fork", "A gist", "A wiki page"], 0,
    "Projects have built-in workflows that automatically update fields, such as setting Status when an item is closed or merged."),

  // ======== Privacy, security, and administration (4) ========
  g("security-1", "security", "Describe how to secure accounts with two-factor authentication (2FA) and passkeys", DOC.passkeys,
    "Which sign-in method is passwordless and resistant to phishing?",
    ["A passkey", "A shorter password", "SMS only", "Sharing credentials with a teammate"], 0,
    "Passkeys use public-key cryptography tied to a device, so there is no password to phish."),

  g("security-2", "security", "Identify access permissions and roles for repositories and organizations", DOC.roles,
    "A contributor should be able to label, assign and manage issues and pull requests but not push code. Which repository role?",
    ["Read", "Triage", "Write", "Admin"], 1,
    "Triage lets people manage issues and pull requests without write access to the code."),

  g("security-3", "security", "Describe repository privacy options, visibility settings, and branch protection rules", DOC.protected,
    "You want pull requests to need an approving review and passing checks before merging into main. What do you configure?",
    ["A branch protection rule for main", "A Gist", "A label", "A GitHub Pages site"], 0,
    "Branch protection rules enforce conditions such as required reviews and status checks before merging."),

  g("security-4", "security", "Explain the purpose of Enterprise Managed Users (EMUs) and organization-wide Copilot policy management", DOC.emu,
    "What is the defining feature of Enterprise Managed Users?",
    ["Accounts are created and controlled by the enterprise through its identity provider.", "Users bring personal accounts and keep full control.", "They are free accounts for students.", "They are public profiles."], 0,
    "With EMU, the enterprise provisions and manages user accounts through its identity provider, centralising control."),

  // ======== Explore the GitHub community (3) ========
  g("community-1", "community", "Describe the benefits of open source and GitHub Sponsors", DOC.sponsors,
    "What does GitHub Sponsors let you do?",
    ["Financially support open-source developers and projects.", "Host private servers.", "Run CI pipelines for free.", "Create template repositories."], 0,
    "GitHub Sponsors lets people and organisations fund open-source maintainers."),

  g("community-2", "community", "Recognize when to use forks, templates, and discoverable repositories to promote collaboration", DOC.forks,
    "You want to contribute to a project where you do not have write access. What is the standard approach?",
    ["Fork the repository, make changes, and open a pull request.", "Ask for the owner's password.", "Create a template repository.", "Delete and recreate the repository."], 0,
    "Forking creates your own copy where you can make changes, then you propose them to the original repository with a pull request."),

  g("community-3", "community", "Recognize when to use forks, templates, and discoverable repositories to promote collaboration", DOC.template,
    "How does a repository created from a template differ from a fork?",
    ["A template creates a new repository with the same files but without the original's commit history, and no link back to it.", "A template always keeps the full history.", "A fork cannot be changed.", "They are identical."], 0,
    "Repositories created from a template start with a clean history, while forks keep the history and stay linked to the upstream repository."),
];
