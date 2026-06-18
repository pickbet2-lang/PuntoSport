import type { RoutePath } from "../types";

export const navigateTo = (route: RoutePath) => {
  window.history.pushState({ route }, "", route);
  window.dispatchEvent(new CustomEvent<RoutePath>("punto-sport:navigate", { detail: route }));
};
