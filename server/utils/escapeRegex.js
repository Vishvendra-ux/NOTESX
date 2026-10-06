// Escape user-supplied strings before embedding them in RegExp literals.
// Prevents 500s from invalid patterns like "(" and ReDoS / CPU-exhaustion
// from crafted patterns like "(a+)+$" when used in $regex queries.
module.exports = function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
