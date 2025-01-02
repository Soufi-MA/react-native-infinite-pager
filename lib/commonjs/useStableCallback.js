"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStableCallback = useStableCallback;
var _react = require("react");
// Utility hook that returns a function that never has stale dependencies, but
// without changing identity, as a useCallback with dep array would.
// Useful for functions that depend on external state, but
// should not trigger effects when that external state changes.

function useStableCallback(cb) {
  const cbRef = (0, _react.useRef)(cb);
  cbRef.current = cb;
  const stableCb = (0, _react.useCallback)((...args) => cbRef.current(...args), []);
  return stableCb;
}
//# sourceMappingURL=useStableCallback.js.map