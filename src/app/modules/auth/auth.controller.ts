import { envVariable } from "../../config/envConfig";
import { nodeEnv } from "../../constant/constant";
import catchAsync from "../../utils/catchAsync";
import setCookie from "../../utils/cookie/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const credentialLogin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.credentialLogin(payload);

  setCookie(res, "accessToken", result.accessToken, 1 * 60 * 60 * 1000);
  setCookie(res, "refreshToken", result.refreshToken, 90 * 24 * 60 * 60 * 1000);

  sendResponse(res, {
    message: "User login successfully",
    data: { needPasswordChange: result.needPasswordChange },
  });
});

export const AuthController = {
  credentialLogin,
};
