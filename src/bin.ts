// todo: CLI frontend

import { DownloadProvider } from "@/download.js";
import logger, { isDebug } from "@/logging/index.js";
import { ToolManager } from "@/tool.js";
import { humanReadableSize } from "@/util.js";

// monitor peak heap usage for debugging
let peakHeap = 0;
let monitorInterval: NodeJS.Timeout;
if (isDebug()) {
	monitorInterval = setInterval(() => {
		const { heapUsed } = process.memoryUsage();
		if (heapUsed > peakHeap) peakHeap = heapUsed;
	}, 500); // check every 500ms
}

await new ToolManager("lune-org", "lune")
	.version((v) => v.match(/^v?0\.10(?:\.\d+)?$/g) != null)
	.install(DownloadProvider.TrackedDownload)
	.finally(() => {
		if (isDebug()) {
			clearInterval(monitorInterval);
			logger.debug("Peak heap usage: %s", humanReadableSize(peakHeap));
		}
	});
