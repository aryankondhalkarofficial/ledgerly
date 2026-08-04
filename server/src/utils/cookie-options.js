const NODE_ENV = process.env.NODE_ENV;

const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "none",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export default cookieOptions;
