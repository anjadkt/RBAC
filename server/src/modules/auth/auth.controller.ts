import { createAccessToken, createRefreshToken } from '../../utils/createTokens'
import { accessCookieOptions, refreshCookieOptions } from '../../utils/cookieOptions'
import { catchAsync } from '../../utils/catchAsync'
import ApiResponse from '../../utils/ApiResponse'
import * as authService from './auth.service'


export const registerController = catchAsync(async (req, res) => {

  const user = await authService.register(req.body);

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

});

export const loginController = catchAsync(async (req, res) => {

  const user = await authService.login(req.body);

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

export const getMeController = catchAsync(async (req, res) => {

  const user = await authService.getMe(req.user?.userId || "");

  res.status(200).json(new ApiResponse(200, "User fetched successfully.", user));

})

export const refreshController = catchAsync(async (req, res) => {

})

export const logoutController = catchAsync(async (_req, res) => {
  return res
    .clearCookie('access_token', accessCookieOptions)
    .clearCookie('refresh_token', refreshCookieOptions)
    .status(200)
    .json(new ApiResponse(200, "Logout successful.", null))
})
