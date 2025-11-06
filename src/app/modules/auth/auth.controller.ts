import { TokenName } from '../../constant/constant';
import catchAsync from '../../utils/catchAsync';
import setCookie from '../../utils/cookie/setCookie';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const credentialLogin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.credentialLogin(payload);

  setCookie(res, TokenName.ACCESS_TOKEN, result.accessToken, 1 * 60 * 60 * 1000);
  setCookie(res, TokenName.REFRESH_TOKEN, result.refreshToken, 90 * 24 * 60 * 60 * 1000);

  sendResponse(res, {
    message: 'User login successfully',
    data: { needPasswordChange: result.needPasswordChange },
  });
});

const getMe = catchAsync(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const result = await AuthService.getMe(accessToken);
  sendResponse(res, {
    message: 'Get me retrieved successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  const result = await AuthService.refreshToken(token);
  setCookie(res, TokenName.ACCESS_TOKEN, result.accessToken, 1 * 60 * 60 * 1000);
});
export const AuthController = {
  credentialLogin,
  getMe,
  refreshToken,
};
