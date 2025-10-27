import pkg from "../package.json" with { type: "json" };

import { isDebug as actionsDebug } from "@actions/core";
import winston from "winston";

export const isDebug = () => process.env.DEV_DEBUG || process.env.NODE_LOG === "debug" || actionsDebug();
const baseFormat = winston.format.combine(
	winston.format.simple(),
	winston.format.errors(),
	winston.format.splat(),
	winston.format((info) => {
		if (info.scope) {
			info.message = `\x1b[2m${info.scope}\x1b[0m: ${info.message}`;
			delete info.scope; // remove so metadata isn't cluttered
		}

		return info;
	})()
);

export default winston.createLogger({
	level: isDebug() ? "debug" : "info",
	format:
		isDebug() && process.env.NODE_ENV === "production"
			? winston.format.json()
			: winston.format.combine(baseFormat, winston.format.cli()),

	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: `${pkg.name}.log`,
			format: winston.format.combine(baseFormat, winston.format.uncolorize()),
			level: "debug"
		})
	]
});
