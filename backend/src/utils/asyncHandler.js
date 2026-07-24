/**
 * Wraps an async Express route handler so thrown errors are forwarded
 * to next() without try/catch boilerplate in every controller.
 *
 * @param {Function} fn - async (req, res, next) => {}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
