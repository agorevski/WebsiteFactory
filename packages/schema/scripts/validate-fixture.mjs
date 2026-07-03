import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseWebsiteYaml } from "../dist/index.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(currentDirectory, "../fixtures/sample.website.yaml");
const yaml = await readFile(fixturePath, "utf8");
const website = parseWebsiteYaml(yaml);

console.log(`Validated sample website data for ${website.business.name}.`);
