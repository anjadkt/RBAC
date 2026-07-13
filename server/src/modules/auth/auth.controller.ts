import User from './user.model'
import bcrypt from 'bcrypt'
import Role from '../role/role.model'
import { createAccessToken, createRefreshToken } from '../../utils/createTokens'
import { accessCookieOptions, refreshCookieOptions } from '../../utils/cookieOptions'
import { catchAsync } from '../../utils/catchAsync'
import ApiError from '../../utils/ApiError'
import ApiResponse from '../../utils/ApiResponse'


export const register = catchAsync(async (req, res) => {

  const { name, email, password } = req.body

  if (!name || !email || !password) throw new ApiError(400, "Name, email, and password are required.");

  const normalizedEmail = String(email).toLowerCase().trim()
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) throw new ApiError(409, "An account with this email already exists.");

  const hashedPass = await bcrypt.hash(password.toString(), 10);

  const role = await Role.findOne({ name: "patient" });

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPass,
    role: role?._id
  });

  const accessToken = createAccessToken({ _id: user._id.toString(), role: user.role, email: user.email });
  const refreshToken = createRefreshToken(user._id.toString());

  return res
    .status(201)
    .cookie('access_token', accessToken, accessCookieOptions)
    .cookie('refresh_token', refreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        201,
        "User registered successfully.",
        { id: user._id, name: user.name, email: user.email }
      )
    )

})

export const login = catchAsync(async (req, res) => {

  const { email, password } = req.body

  if (!email || !password) throw new ApiError(400, "Email and password are required.");

  const user = await User.findOne({ email: String(email).toLowerCase().trim() })
  if (!user) throw new ApiError(401, "Invalid email or password.");

  const isVerified = await bcrypt.compare(password.toString(), user.password);
  if (!isVerified) throw new ApiError(401, "Invalid email or password.");

  const accessToken = createAccessToken({
    _id: user._id.toString(),
    role: user.role,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin || false
  })
  const refreshToken = createRefreshToken(user._id.toString());

  return res
    .status(200)
    .cookie('access_token', accessToken, accessCookieOptions)
    .cookie('refresh_token', refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, "Login successful.", { id: user._id, name: user.name, email: user.email }))

})

export const getMe = catchAsync(async (req, res) => {

  const user = req.user

  return res.status(200).json(new ApiResponse(200, "User fetched successfully.", user))

})

export const refresh = catchAsync(async (req, res) => {

})

export const logout = catchAsync(async (_req, res) => {
  return res
    .clearCookie('access_token', accessCookieOptions)
    .clearCookie('refresh_token', refreshCookieOptions)
    .status(200)
    .json(new ApiResponse(200, "Logout successful.", null))
})
