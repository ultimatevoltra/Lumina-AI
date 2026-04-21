import { Router, type IRouter } from "express";
import Stripe from "stripe";

const router: IRouter = Router();

const PLANS: Record<string, { name: string; amount: number; currency: string }> = {
  pro:     { name: "Lumina AI Pro",     amount: 999,   currency: "usd" },
  premium: { name: "Lumina AI Premium", amount: 1999,  currency: "usd" },
  max:     { name: "Lumina AI Max",     amount: 3999,  currency: "usd" },
  ultra:   { name: "Lumina AI Ultra",   amount: 7999,  currency: "usd" },
};

router.post("/checkout", async (req, res): Promise<void> => {
  const secretKey = process.env["STRIPE_SECRET_KEY"];
  if (!secretKey) {
    res.status(503).json({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY." });
    return;
  }

  const { planId, successUrl, cancelUrl } = req.body as {
    planId?: string;
    successUrl?: string;
    cancelUrl?: string;
  };

  if (!planId || !PLANS[planId]) {
    res.status(400).json({ error: "Invalid planId. Must be one of: pro, premium, max, ultra." });
    return;
  }

  const plan = PLANS[planId]!;

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: { name: plan.name },
            unit_amount: plan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl ?? `${req.headers.origin ?? "https://lumina.ai"}/pricing?success=1&plan=${planId}`,
      cancel_url: cancelUrl ?? `${req.headers.origin ?? "https://lumina.ai"}/pricing?cancelled=1`,
    });

    res.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe error";
    req.log.error({ err, planId }, "Stripe checkout failed");
    res.status(500).json({ error: message });
  }
});

export default router;
