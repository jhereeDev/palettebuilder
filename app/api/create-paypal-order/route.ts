// app/api/create-paypal-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

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
	const { plan } = await req.json();

	const accessToken = await generateAccessToken();
	const url = `${PAYPAL_API_URL}/v2/checkout/orders`;

	const payload = {
		intent: 'CAPTURE',
		purchase_units: [
			{
				amount: {
					currency_code: 'USD',
					value: plan === 'monthly' ? '5.00' : '50.00',
				},
				description: plan === 'monthly' ? 'Monthly Subscription' : 'Yearly Subscription',
			},
		],
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(payload),
	});

	const data = await response.json();
	return NextResponse.json(data);
}
