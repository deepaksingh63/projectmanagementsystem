import AppError from "../utils/AppError.js";

const validateRequest = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const issue = result.error.issues[0];
    return next(new AppError(issue.message, 400));
  }

  req.validated = result.data;
  next();
};

export default validateRequest;
