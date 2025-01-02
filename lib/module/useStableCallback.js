// Utility hook that returns a function that never has stale dependencies, but
// without changing identity, as a useCallback with dep array would.
// Useful for functions that depend on external state, but
// should not trigger effects when that external state changes.

import { useCallback, useRef } from "react";
export function useStableCallback(cb) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  const stableCb = useCallback((...args) => cbRef.current(...args), []);
  return stableCb;
}
//# sourceMappingURL=useStableCallback.js.map