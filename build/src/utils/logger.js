"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LOG_THRESHOLDS = void 0;
const dotenv = require("dotenv");
dotenv.config();
var LOG_THRESHOLDS;
(function (LOG_THRESHOLDS) {
    LOG_THRESHOLDS[LOG_THRESHOLDS["LOG"] = 0] = "LOG";
    LOG_THRESHOLDS[LOG_THRESHOLDS["INFO"] = 1] = "INFO";
    LOG_THRESHOLDS[LOG_THRESHOLDS["WARNING"] = 2] = "WARNING";
    LOG_THRESHOLDS[LOG_THRESHOLDS["ERROR"] = 3] = "ERROR";
})(LOG_THRESHOLDS || (exports.LOG_THRESHOLDS = LOG_THRESHOLDS = {}));
const LOG_THRESHOLD = parseInt((_a = process.env.LOG_THRESHOLD) !== null && _a !== void 0 ? _a : "0");
class Logger {
    constructor(threshold = LOG_THRESHOLDS.INFO) {
        this.threshold = LOG_THRESHOLDS.INFO;
        this.threshold = threshold;
    }
    forceLog(message, ...optionalParams) {
        console.log(message, ...optionalParams);
    }
    log(message, ...optionalParams) {
        if (this.threshold <= LOG_THRESHOLDS.INFO) {
            this.forceLog(message, ...optionalParams);
        }
        else {
            // 
        }
    }
    forceInfo(message, ...optionalParams) {
        console.info(message, ...optionalParams);
    }
    info(message, ...optionalParams) {
        if (this.threshold <= LOG_THRESHOLDS.INFO) {
            this.forceInfo(message, ...optionalParams);
        }
        else {
            // 
        }
    }
    forcewarn(message, ...optionalParams) {
        console.warn(message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        if (this.threshold <= LOG_THRESHOLDS.WARNING) {
            this.forcewarn(message, ...optionalParams);
        }
        else {
        }
    }
    forceerror(message, ...optionalParams) {
        console.error(message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        if (this.threshold <= LOG_THRESHOLDS.ERROR) {
            this.forceerror(message, ...optionalParams);
        }
        else {
        }
    }
}
exports.Logger = Logger;
const logger = new Logger(LOG_THRESHOLD !== null && LOG_THRESHOLD !== void 0 ? LOG_THRESHOLD : LOG_THRESHOLDS.LOG);
exports.logger = logger;
//# sourceMappingURL=logger.js.map