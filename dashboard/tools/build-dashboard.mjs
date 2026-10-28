import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "src", "index.template.html");
const includePattern = /<!--\s*@include\s+([^\s]+)\s*-->/g;

const cssFiles = [
    "styles/base/tokens-and-base.css",
    "styles/layout/header.css",
    "styles/layout/main.css",
    "styles/components/cards.css",
    "styles/components/panels.css",
    "styles/components/ip-table.css",
    "styles/components/table-toolbar.css",
    "styles/components/event-table.css",
    "styles/components/pagination.css",
    "styles/components/badges.css",
    "styles/components/scrollbars.css",
    "styles/layout/footer.css",
    "styles/responsive.css",
    "styles/components/animations.css",
    "styles/components/charts.css",
    "styles/pages/enforcement.css",
    "styles/components/notifications.css",
    "styles/components/surfaces.css",
    "styles/components/inline-replacements.css",
];

const jsFiles = [
    "scripts/config/dashboard-config.js",
    "scripts/core/http-compat.js",
    "scripts/core/dom.js",
    "scripts/i18n/translations.js",
    "scripts/core/state.js",
    "scripts/core/router.js",
    "scripts/i18n/language.js",
    "scripts/core/date-time.js",
    "scripts/core/detection.js",
    "scripts/charts/dashboard-charts.js",
    "scripts/components/top-ip-table.js",
    "scripts/components/event-search.js",
    "scripts/components/event-sorting.js",
    "scripts/components/event-filtering.js",
    "scripts/components/event-table.js",
    "scripts/components/pagination.js",
    "scripts/services/dashboard-service.js",
    "scripts/app/events.js",
    "scripts/app/bootstrap.js",
    "scripts/components/toast.js",
    "scripts/components/notification-center.js",
    "scripts/pages/enforcement.js",
    "scripts/pages/history.js",
];

function assemble(file, stack = []) {
    const absolute = path.resolve(file);
    if (!absolute.startsWith(root + path.sep)) throw new Error("Include escaped dashboard root");
    if (stack.includes(absolute)) throw new Error("Circular include: " + absolute);
    const source = fs.readFileSync(absolute, "utf8");
    return source.replace(includePattern, (_, relative) => assemble(path.join(root, relative), [...stack, absolute]));
}

function bundle(files) {
    return files.map(relative => {
        const source = fs.readFileSync(path.join(root, relative), "utf8").trim();
        return `/* Source: ${relative} */\n${source}`;
    }).join("\n\n") + "\n";
}

fs.mkdirSync(path.join(root, "dist"), {recursive: true});
fs.writeFileSync(path.join(root, "dist", "dashboard.css"), bundle(cssFiles), "utf8");
fs.writeFileSync(path.join(root, "dist", "dashboard.js"), bundle(jsFiles), "utf8");

const output = assemble(templatePath);
if (/<style(?:\s|>)/i.test(output) || /\sstyle=/i.test(output)) throw new Error("Inline style detected");
if (/<script>([\s\S]*?)<\/script>/i.test(output)) throw new Error("Inline script detected");
const applicationRoots = ["src", "components", "pages", "scripts"];
for (const applicationRoot of applicationRoots) {
    const scan = directory => {
        for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
            const target = path.join(directory, entry.name);
            if (entry.isDirectory()) scan(target);
            else if (/\.(?:html|js)$/i.test(entry.name)) {
                const source = fs.readFileSync(target, "utf8");
                if (/\sstyle\s*=/i.test(source) || /\.style(?:\.|\[)/.test(source)) {
                    throw new Error(`Inline style API detected in ${path.relative(root, target)}`);
                }
            }
        }
    };
    scan(path.join(root, applicationRoot));
}
const ids = [...output.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error("Duplicate IDs: " + duplicates.join(", "));
fs.writeFileSync(path.join(root, "index.html"), output, "utf8");
console.log("Dashboard built: index.html (" + ids.length + " unique IDs)");
