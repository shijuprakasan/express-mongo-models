const dotenv = require("dotenv");

dotenv.config();

export enum LOG_THRESHOLDS {
  LOG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
}

const LOG_THRESHOLD: LOG_THRESHOLDS = parseInt(
  process.env.LOG_THRESHOLD ?? "0"
) as LOG_THRESHOLDS;

export interface ILogger {
  log(message?: any, ...optionalParams: any[]): void;
}

export class Logger implements ILogger {
  threshold: LOG_THRESHOLDS = LOG_THRESHOLDS.INFO;

  constructor(threshold: LOG_THRESHOLDS = LOG_THRESHOLDS.INFO) {
    this.threshold = threshold;
  }

  forceLog(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  log(message?: any, ...optionalParams: any[]): void {
    if (this.threshold <= LOG_THRESHOLDS.INFO) {
      this.forceLog(message, ...optionalParams);
    } else {
      // 
    }
  }

  forceInfo(message?: any, ...optionalParams: any[]): void {
    console.info(message, ...optionalParams);
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (this.threshold <= LOG_THRESHOLDS.INFO) {
      this.forceInfo(message, ...optionalParams);
    } else {
      // 
    }
  }

  forcewarn(message?: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.threshold <= LOG_THRESHOLDS.WARNING) {
      this.forcewarn(message, ...optionalParams);
    } else {
    }
  }

  forceerror(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (this.threshold <= LOG_THRESHOLDS.ERROR) {
      this.forceerror(message, ...optionalParams);
    } else {
    }
  }
}

const logger = new Logger(LOG_THRESHOLD ?? LOG_THRESHOLDS.LOG);

export { logger };
