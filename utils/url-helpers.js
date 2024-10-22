export function urlPath(applicationPath) {
  return `${applicationPath}`;
}

export function builderUrl(applicationPath, request) {
  return new URL(urlPath(applicationPath), request.url);
}
