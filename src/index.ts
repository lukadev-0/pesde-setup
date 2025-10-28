import { ToolManager } from "./tool.js";
import { humanReadableSize } from "./util.js";

let peakHeap = 0;
const monitorInterval = setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  if (heapUsed > peakHeap) peakHeap = heapUsed;
}, 500); // check every 500ms

await new ToolManager("lune-org", "lune")
	.version((v) => v.match(/^v?0\.10(?:\.\d+)?$/g) != null)
	.install()
	.finally(() => clearInterval(monitorInterval));

console.log("Peak heap usage: ", humanReadableSize(peakHeap))


// todo: structured errors
