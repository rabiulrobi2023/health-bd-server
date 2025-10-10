import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const credentialLogin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.credentialLogin(payload);
  sendResponse(res, {
    message: "User login successfully",
    data: result,
  });
});

export const AuthController = {
  credentialLogin,
};
