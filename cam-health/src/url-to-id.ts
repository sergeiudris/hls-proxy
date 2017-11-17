export function urlToIdString(url: string) {
  return url.replace(/(\/|\\|:|\.)/g, '_')
}
