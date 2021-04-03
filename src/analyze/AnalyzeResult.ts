import { failOn, FailOn } from "../utils/FailOn";
import { ParsedLine } from "./ParsedLine";

export interface AnalyzeResultCountsInterface {
  info: number;
  warnings: number;
  errors: number;
}

/**
 * Different log counts from the dart Analyze
 */
class AnalyzeResultCounts {
  info: number;
  warnings: number;
  errors: number;
  constructor(params: AnalyzeResultCountsInterface) {
    this.info = params.info;
    this.warnings = params.warnings;
    this.errors = params.errors;
  }

  /**
   * The total number of logs
   */
  public get total(): number {
    return this.info + this.warnings + this.errors;
  }

  public get failCount(): number {
    let count = 0;
    if (failOn !== FailOn.Nothing) {
      count += this.errors;
      if (failOn !== FailOn.Error) {
        count += this.warnings;
        if (failOn !== FailOn.Warning) {
          count += this.info;
        }
      }
    } 
    return count;
  }
}


/**
 * Result of dart analyze
 */
export interface AnalyzeResultInterface {
  counts: AnalyzeResultCountsInterface;
  lines: ParsedLine[];
}

export class AnalyzeResult {
  counts: AnalyzeResultCounts;
  lines: ParsedLine[];

  constructor(params: AnalyzeResultInterface) {
    this.counts = new AnalyzeResultCounts(params.counts);
    this.lines =  params.lines;
  }

  // Whether it is a success (not failing results)
  public get isSuccess(): boolean {
    return !this.counts.failCount
  }

  // Whether it has logs (even not failing ones)
  public get hasWarning(): boolean {
    return !!this.counts.total;
  }
}