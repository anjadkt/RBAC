import { accessCookieOptions, refreshCookieOptions } from '../../utils/cookieOptions'
import { catchAsync } from '../../utils/catchAsync'
import ApiResponse from '../../utils/ApiResponse'
import * as authService from './auth.service'


export const registerController = catchAsync(async (req, res) => {

  const { user, accessToken, refreshToken } = await authService.register(req.body);

  return res
    .status(201)
    .cookie('access_token', accessToken, accessCookieOptions)
    .cookie('refresh_token', refreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        201,
        "User registered successfully.",
        user
      )
    )

});

export const loginController = catchAsync(async (req, res) => {

  const { user, accessToken, refreshToken } = await authService.login(req.body);

  return res
    .status(200)
    .cookie('access_token', accessToken, accessCookieOptions)
    .cookie('refresh_token', refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, "Login successful.", user))

})

export const getMeController = catchAsync(async (req, res) => {

  const user = await authService.getMe(req.user?.userId || "");

  res.status(200).json(new ApiResponse(200, "User fetched successfully.", user));

})

export const refreshController = catchAsync(async (req, res) => {

  const { accessToken, refreshToken } = await authService.refresh(req.cookies.refresh_token || "");

  return res
    .status(200)
    .cookie('access_token', accessToken, accessCookieOptions)
    .cookie('refresh_token', refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, "Tokens refreshed successfully.", null));
})

export const logoutController = catchAsync(async (req, res) => {

  await authService.logout(req.user?.userId || "");
  return res
    .clearCookie('access_token', accessCookieOptions)
    .clearCookie('refresh_token', refreshCookieOptions)
    .status(200)
    .json(new ApiResponse(200, "Logout successful.", null))
})
