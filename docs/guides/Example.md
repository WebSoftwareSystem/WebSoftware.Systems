Example Guide
=============

01 - Requirements
-----------------

When building a Web Software System (WSS) a core set of tools are necessary and chosen due to their ubiquitous nature which provides for a stable base and quick starting point.

  * [Unix](https://www.opengroup.org/membership/forums/platform/unix) - The **Operating System** foundation for development and production.
  * [Bash](https://www.gnu.org/software/bash/) - The foundational **Shell** for **Operating System** instructions.
  * [git](https://git-scm.com/) - The distributed **Version Control System** to facilitate progress.
  * [Node.js](https://nodejs.org/) - The root **Runtime** for tooling.
  * [Docker](https://www.docker.com/resources/what-container) - The portable **Container** for operations.
  * [Github](https://github.com/) - The seed **Distribution** and collaboration platform.
  * [pinf.it](https://github.com/pinf-it/core) - The central bootstrapping **Virtual System** that tracks & coordinates everything.

02 - Install & Run
------------------

    git clone https://github.com/WebSoftwareSystem/WebSoftware.Systems.git
    cd WebSoftware.Systems

    ./run.sh
    ./run.sh --help

03 - Bootstrapping
------------------

Every system has a starting point when it was first conceived or implemented. From this starting point, every decision adds to the system and causes it to grow into the direction chosen.

This progression is tracked in terms of code through the history of the `git` repository. Tracking just code is not sufficient and other aspects of the evolution, such as code paths, layers and relationships, must also be tracked.

This is achieved by treating all aspects of the system in code and ensuring that all aspects can be reached by executing one central code path. Thus a systems codebase and project becomes the system as the project is executed to bootstrap the system for development and production purposes.

The `pinf.it` tool provides such a mechanism to a project codebase and is used to bootstrap this WSS. In further examples below, the capabilities of `pinf.it` will be detailed with a focus of what they bring. The reader is cautioned that the `pinf.it` tool is under active development and not yet recommended for use outside of specific exploratory projects as there is no support available.

When the user runs `./run.sh`, this WSS is started using `pinf.it ./` which will boot up a **Virtual System Model** that is populated by mapped interface definitions of components that make up the system. To provide a surface for interaction with the system, a **Development Workspace** is composed and made manifest by sequentially executing the instructions in `#!/#!inf.json`.

Details about the **Virtual System Model** will follow after sufficient practical aspects of a WSS are covered as the reader requires some background in order to appreciate the concerns that the model is cohering.

03 - Development Workspace Levels
---------------------------------

The **Development Workspace** is at its lowest level the working directory of the `.git` repository. The workspace spans multiple levels and reaches up the stack all the way to a visual user experience.

  1. `.git` repository
  2. `bash` shell
  3. Disposable **Containers**
  4. **HTTP** service
  5. **Web Browser** page

A WSS workspace is booted using **one command** which will start the system and open the workspace. The act of starting the system ensures that all aspects of the codebase are functional before beginning work. The system starts by booting up a local development environment and launching all services needed and practical. Further services may be deployed into third party remote platforms and connected to the workspace for development purposes. The extent of this unfoldment is structured by composing parts relationships and controlled by development profiles.

The flow of the workspace boot process follows including an outline of the environment that each level provides.

  * The user invokes `./run.sh` as the only command needed to open the workspace.
  * `pinf.it` sequentially executes instructions from `#!/#!inf.json`.
  * `#!/#!inf.json` holds step by step instructions to compose and launch workspace environments using pre-built tools.
  * The **first** workspace level that is booted is a `bash` **shell** interface that is opened in the same terminal where the user invoked the system.

### Workspace Level 01: `.git` repository

  * The **Codebase** of the system that is persisted on many nodes and shared with other contributors.
  * Records all **Infrastructure** component parts relationships.
  * Stiched together using one central code execution path able to reach every aspect of the system.
  * Provides a central, eventually consistent, repository.
  * Snapshots in time.
  * Parallel development progressions with eventual re-integration.
  * Registry for external references.

### Workspace Level 02: `bash` shell

  * Structured by code from *workspace level 01*.
  * Controlled by user.
  * Initial working directory is the root of the system repository.
  * `bash` terminal for arbitrary **Operating System** command invocation.
  * **Environment Variables** that frame the workspace foundation.
  * **User Commands** to interact with the system.
  * **Launch List** to further unfold the system and workspace.

### Workspace Level 03: Disposable **Containers**

  * Structured by code from *workspace level 01*.
  * Controlled by instructions from *workspace level 02*.
  * **Environment Variables** from *workspace level 02*.
  * Launched when needed and destroyed when done.
  * Uses `docker` to run portable **Containers**.
  * Run locally and remotely.

### Workspace Level 04: **HTTP** service

  * Structured by code from *workspace level 01*.
  * Controlled by instructions from *workspace level 02*.
  * Long-running process server.
  * Keeps realtime status.
  * Provides a central registry.
  * **Meta Data** API for tools and UIs.
  * Standard interfaces.

### Workspace Level 05: **Web Browser** page

  * Structured by code from *workspace level 01*.
  * Animated by services from *workspace level 04*.
  * Controlled by user.
  * Central portal into system.
  * Surfaces all relevant internals.
  * **User Interface** for interacting with system.
  * Different **Views** into the **System Model**.
  * Faciliated **Workflows**.

04 - Workspace Level 01: `.git` repository
------------------------------------------

The stability of the system and workspace is of upmost importance at the lowest level and thus techniques are employed to ensure the realization of this principle not only at the foundational levels but also throughout the whole stack. At the `.git` repository level this is relfected by ensuring that the workspace is bootable in multiple locations at all times.

This boot stability property can be satisfied in a *local context* by booting the system in a `docker` container as well as directly on the user's *host* operating system. It can be elevated to third party solidification by leveraging a service such as [github.com](https://github.com/) for continuous builds and external review.

Tools can be employed to configure [Github Actions](https://github.com/features/actions) and other services through minimal configuration and thus the pursuit of **solid stability** can be easily seeded for any project. The reader is cautioned that the use of Github is not necessarily recommended and only suggested to easily satisfy this boot stability property, and others, in cases where the author feels it is appropriate. There are many other options available and the free exchange to how a property is realized is an essential tenet of a WSS.

The bootstrap control flow of the `git` workspace level of this WSS project can be found in `./#!/Workspace-01.inf.json` which references instruction modules from `./#!/Workspace-01/*.inf.json`.
