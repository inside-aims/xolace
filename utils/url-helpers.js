export function urlPath(applicationPath) {
  return applicationPath.startsWith("/") ? applicationPath : `/${applicationPath}`;
}

export function builderUrl(applicationPath, request) {
  return new URL(urlPath(applicationPath), request.url);
}
