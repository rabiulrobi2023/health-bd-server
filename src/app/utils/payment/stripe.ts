import Stripe from "stripe";
import { envVariable } from "../../config/envConfig";

export const stripe = new Stripe(envVariable.STRIPE_SECRET_KEY);
