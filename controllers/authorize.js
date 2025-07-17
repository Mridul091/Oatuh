console.log("Authorize controller loaded");
exports.authorize = async (req, res) => {
  console.log("Authorize endpoint hit");
  const { client_id, redirect_uri, response_type, scope, state } = req.query;
  res.render("login", { client_id, redirect_uri, state });
};
