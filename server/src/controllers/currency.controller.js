import User from "../models/user.model.js";
import serverError from "../utils/server-error.js";

const updateCurrency = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.user,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Currency updated",
      user: {
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export default updateCurrency;
