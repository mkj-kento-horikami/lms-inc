declare module 'papaparse' {
  export interface ParseConfig {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    dynamicTyping?: boolean | { [key: string]: boolean };
    preview?: number;
    encoding?: string;
    worker?: boolean;
    comments?: string | boolean;
    step?: (results: ParseResult, parser: Parser) => void;
    complete?: (results: ParseResult) => void;
    error?: (error: ParseError, file: File) => void;
    download?: boolean;
    skipEmptyLines?: boolean | 'greedy';
    chunk?: (results: ParseResult, parser: Parser) => void;
    fastMode?: boolean;
    beforeFirstChunk?: (chunk: string) => string | void;
    withCredentials?: boolean;
    transform?: (value: string, field: string | number) => any;
  }

  export interface ParseResult {
    data: any[];
    errors: ParseError[];
    meta: ParseMeta;
  }

  export interface ParseError {
    type: string;
    code: string;
    message: string;
    row: number;
  }

  export interface ParseMeta {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
    fields?: string[];
  }

  export interface Parser {
    abort: () => void;
    getCharIndex: () => number;
  }

  export function parse(input: string | File, config?: ParseConfig): ParseResult;
}