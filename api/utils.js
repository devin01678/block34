const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");

function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  } else {
    next();
  }
}

async function setUser(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return next();
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    if (id) {
      req.user = await getUserById(id);
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requireUser,
  setUser,
};
