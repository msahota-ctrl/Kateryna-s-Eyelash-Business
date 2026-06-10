import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceName,
      servicePrice,
      appointmentDate,
      appointmentTime,
      clientName,
      clientEmail,
      clientPhone,
    } = body;

    if (
      !serviceName ||
      !servicePrice ||
      !appointmentDate ||
      !appointmentTime ||
      !clientName ||
      !clientEmail ||
      !clientPhone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: clientEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: serviceName,
              description: `Appointment on ${appointmentDate} at ${appointmentTime}`,
            },
            unit_amount: Math.round(parseFloat(servicePrice) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        service_name: serviceName,
        service_price: String(servicePrice),
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
