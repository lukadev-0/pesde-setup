import { ToolManager } from "./tool.js";

new ToolManager("lune-org", "lune").version((v) => v.match(/^v?0\.10(?:\.\d+)?$/g) != null).install();

// todo: structured errors
