// polyfills.ts
import {ReadableStream} from 'web-streams-polyfill/ponyfill/es6'
if (typeof window.ReadableStream === 'undefined')      window.ReadableStream = ReadableStream as any


