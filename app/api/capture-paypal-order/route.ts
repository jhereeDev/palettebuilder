// app/api/capture-paypal-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } = process.env;

async function generateAccessToken() {
	const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64');
	const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
		method: 'POST',
		body: 'grant_type=client_credentials',
		headers: {
			Authorization: `Basic ${auth}`,
		},
	});
	const data: any = await response.json();
	return data.access_token;
}

export async function POST(req: NextRequest) {
	const { orderID, clerkUserId } = await req.json();

	try {
		const accessToken = await generateAccessToken();
		const url = `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const data: any = await response.json();

		if (response.status === 201) {
			// Payment successful
			const user = await db.select().from(users).where(eq(users.clerkId, clerkUserId)).limit(1);
			const amount = data.purchase_units[0].payments.captures[0].amount.value;
			const subscriptionTier = amount === '5.00' ? 'monthly' : 'yearly';

			if (user.length > 0) {
				await db
					.update(users)
					.set({
						subscriptionTier,
						subscriptionStatus: 'active',
						paypalSubscriptionId: data.id,
					})
					.where(eq(users.id, user[0].id));
			}

			return NextResponse.json({ status: 'COMPLETED' });
		} else if (response.status === 422 && data.details?.[0]?.issue === 'INSTRUMENT_DECLINED') {
			// Payment method declined
			return NextResponse.json({ error: 'INSTRUMENT_DECLINED' }, { status: 422 });
		} else {
			// Other errors
			console.error('PayPal API Error:', data);
			return NextResponse.json({ error: 'PAYMENT_ERROR' }, { status: 500 });
		}
	} catch (error) {
		console.error('Server Error:', error);
		return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
	}
}
