const userCustomResult = async (req, res, next) => {
  req.query.select = "email _id name";
  next();
};

module.exports = userCustomResult;
