# ADR 0001: TypeScript monorepo foundations

- **Status:** Accepted
- **Decision:** Use TypeScript for frontend, API, shared package, tests, Prisma configuration/seed, and runnable scripts. Keep standard package metadata and tool-native config in JSON, YAML, or the configuration format required by the tool.
- **Context:** The workspace is intended to provide typed contracts across React, Express, and Prisma without implementing task workflows during initialization.
- **Compatibility:** TypeScript 6.0.3 is selected with `typescript-eslint` 8.73.0, whose published peer range is `>=4.8.4 <6.1.0`. TypeScript 7.0.2 is newer but is outside that peer range. Revisit TypeScript 7 when the lint parser declares support.
- **Consequences:** Browser code uses Vite/Bundler resolution; Node packages use NodeNext and explicit ESM exports. Shared code is built to JavaScript plus declarations for runtime package consumption. Jest transpiles TypeScript with Babel, while `tsc --noEmit` is a distinct quality gate.
