# Puratos Contact Us RJSF demo

Runnable prototype of the recommended AEM/React rendering model. The application imports its source-controlled [`journey-definition draft`](./schema/2026-08-28-contact-us-journey-definition-draft.json), renders its `FORM` nodes with RJSF and visualizes the boundary where OutSystems validates and chooses the authoritative next node.

## Required software

| Dependency | Supported version | Why it is needed |
|---|---:|---|
| Node.js | `^20.19.0` or `>=22.12.0` | Runs the setup script, Vite and the React build |
| npm | Bundled with the supported Node.js installation | Performs the reproducible `package-lock.json` installation |
| Modern browser | Current Edge, Chrome, Firefox or Safari | Runs the local prototype |
| Git | Any maintained version; optional after download | Clones and updates the repository |

No global React, RJSF, Vite, Java, .NET, Python or OutSystems installation is required. Application packages are installed locally under `node_modules` from the committed lockfile.

The principal application dependencies are React 18.3.1, RJSF 5.24.13, AJV 8.18.0 and Vite 8.2.0. Exact direct and transitive versions are recorded in [`package-lock.json`](./package-lock.json).

## Cross-platform setup

The setup program uses only Node.js standard-library APIs and works on Linux, macOS and Windows. From the `contact-us-rjsf-demo` directory, run:

```bash
node scripts/setup.mjs
```

It performs five deterministic checks and actions:

1. Verifies the supported Node.js version and the presence of the lockfile.
2. Installs the exact dependency tree with `npm ci`.
3. Runs `npm audit --audit-level=low`.
4. Tests the internal employee-count routing boundaries with `npm test`.
5. Creates the production bundle with `npm run build`.

The equivalent npm command is `npm run setup`. The script stops immediately and returns a non-zero exit code if any step fails.

The repository's `Prototype CI` workflow runs this same script on `ubuntu-latest`, `macos-latest` and `windows-latest` so operating-system compatibility is continuously verified.

## Run locally

```bash
npm run setup
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Routing tests

```bash
npm test
```

The boundary tests cover the retained routing bands: `1`, `2-5`, `6-20` and `21+`. The form submits only the exact positive integer; the prototype's `employeeRouting.js` simulates the versioned OutSystems rule set that derives the internal band and next-node outcome.

## Demonstrated behavior

- Anonymous and authenticated entry points.
- Exact employee-count capture, with internal range classification for simulated server routing.
- Conditional bakery-chain store count.
- Simulated OutSystems service-model decision.
- Distributor national/regional conditional fields.
- Authenticated order-reference lookup.
- Belgium VAT validation and separate privacy/marketing choices.
- Node, JSON Schema and RJSF `uiSchema` inspector.
- Explicit `constAsDefaults: 'never'` protection so required privacy acknowledgement is never preselected by schema default-state computation.

## Reference captures

- [Desktop server-decision boundary](./output/playwright/desktop-server-decision.png)
- [Mobile signed-in form](./output/playwright/mobile-signed-in-form.png)
- [Mobile schema inspector](./output/playwright/mobile-schema-inspector.png)

## Verification

- Production build succeeds with the pinned RJSF 5.24.13 / AJV 8.18.0 and Vite 8.2.0 dependency line.
- `npm audit --audit-level=low` reports zero known vulnerabilities.
- Desktop and 390×844 mobile browser QA completed with no console errors or warnings.
- Verified anonymous qualification, exact employee-count capture and boundary routing, bakery-chain and distributor dependencies, explicit unchecked consent, OutSystems decision simulation, authenticated order lookup and durable intake completion.

The local transition evaluator and destination actions are explicitly marked as simulations. In the target architecture, AEM posts every step to OutSystems and uses the server-returned next node.
