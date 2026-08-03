const serverError = (error, res) => {
  console.error(error.message);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default serverError;
