export const validate = (schema) => (req, res, next) => {
  const result = schema.parse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  req.validated = result;
  next();
};
