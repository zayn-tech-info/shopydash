export function reloadApp(path = "/", replace = true) {
  if (typeof window === "undefined") return;
  try {
    if (replace) {
      window.location.replace(path);
    } else {
      window.location.assign(path);
    }
  } catch (err) {
 
    window.location.href = path;
  }
}
