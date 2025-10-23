/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVariable } from "../../config/envConfig";
import catchAsync from "../../utils/catchAsync";
import { stripe } from "../../utils/payment/stripe";

import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const handleStripWebhookEvent = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  const webhookSecret = envVariable.STRIPE_WEBHOOK_SECRET_KEY;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const result = await PaymentService.handleStripeWebhookEvent(event);
  sendResponse(res, {
    message: "Webhook req send successfully",
    data: result,
  });
});

export const PaymentController = {
  handleStripWebhookEvent,
};
