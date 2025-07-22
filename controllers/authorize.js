console.log("Authorize controller loaded");
exports.authorize = async (req, res) => {
  console.log("Authorize endpoint hit");
  const {
    client_id,
    redirect_uri,
    response_type,
    scope,
    state,
    code_challenge,
    code_challenge_method,
  } = req.query;
  if (response_type !== "code") {
    return res.status(400).json({ message: "Invalid response type" });
  }
  res.render("login", {
    client_id,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method,
  });
};
