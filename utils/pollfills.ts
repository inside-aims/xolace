// polyfills.ts
if (typeof window !== "undefined") {
    import("web-streams-polyfill/ponyfill/es6").then(({ ReadableStream }) => {
      if (typeof window.ReadableStream === "undefined") {
        window.ReadableStream = ReadableStream as any
      }
    })
  }

