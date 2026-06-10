import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { insertBooking } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata;

    if (!meta) {
      console.error("No metadata on session", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      insertBooking.run({
        stripe_session_id: session.id,
        service_name: meta.service_name,
        service_price: parseInt(meta.service_price, 10),
        appointment_date: meta.appointment_date,
        appointment_time: meta.appointment_time,
        client_name: meta.client_name,
        client_email: meta.client_email,
        client_phone: meta.client_phone,
      });
      console.log("Booking saved for session:", session.id);
    } catch (err) {
      console.error("Failed to save booking:", err);
    }
  }

  return NextResponse.json({ received: true });
}
