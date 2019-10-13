export const withMiddleware = handler => async (req, res) => {
   return handler(req, res);
};
