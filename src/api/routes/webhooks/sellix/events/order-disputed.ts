import { Client, EmbedBuilder } from "discord.js";
import pool from "../../../../../config/database";
import getExistingTicket from "../../../../../utils/getExistingTicket";
import getOrDefault from "../../../../../utils/getOrDefault";
import sleep from "../../../../../utils/sleep";

export default async (
	payload: any,
	store: any,
	client: Client
): Promise<void> => {
	const connection = await pool.getConnection();
	var discordId = null;
	var redeemedAt: Date | null = null;
	try {
		const rs = await connection.execute(
			`SELECT user_id, redeemed_at FROM Invoices WHERE invoice_id = ?;`,
			[payload.uniqid]
		);

		if (rs.length > 0) {
			// @ts-ignore
			discordId = rs[0].user_id;
			// @ts-ignore
			redeemedAt = rs[0].redeemed_at;
		}
	} catch (e) {
		console.log(e);
	} finally {
		connection.release();
	}

	const channelId = store.disputeChannel;
	try {
		var channel = await client.channels.fetch(channelId);
	} catch (e) {
		console.log(
			`Failed to fetch dispute channel for store ${store.name}:\n${e}`
		);
		return;
	}

	if (!channel || !channel.isTextBased() || !channel.isSendable()) {
		console.log(
			`Failed to fetch dispute channel for store ${store.name}! (or channel is not a text channel)`
		);
		return;
	}

	try {
		var g = await client.guilds.fetch(store.discordId);
	} catch (e) {
		console.log(`Failed to fetch guild for store ${store.name}:\n${e}`);
		return;
	}
	if (!g) {
		console.log(`Failed to fetch guild for store ${store.name}`);
		return;
	}

	var inDiscord;
	try {
		inDiscord = await g.members.fetch(discordId);
	} catch (e) {
		console.log(
			`Discord member ${discordId} is not in guild for store ${store.name}`
		);
	}

	var existingTicket = await getExistingTicket(
		client,
		store.disputeCategories,
		store,
		discordId
	);

	if (!existingTicket) {
		await channel.send({
			content: `$new ${discordId}`
		});
		await sleep(5000);
		existingTicket = await getExistingTicket(
			client,
			store.disputeCategories,
			store,
			discordId,
			true
		);
	}

	if (!existingTicket) {
		console.log("Ticket creation failed for dispute!");
		return;
	}

	const discordUser = await client.users.fetch(discordId).catch(() => {
		console.log(`Failed to fetch discord user`);
		return;
	});
	if (!discordUser) {
		console.log(`Failed to fetch discord user ${discordId}`);
	}

	await existingTicket.edit({
		name: `${discordUser ? discordUser.username : discordId}-dispute`
	});
	const disputeMsg = new EmbedBuilder().setAuthor({
		name: "⚔️ New Dispute Opened",
		iconURL: g.iconURL()!
	}).setDescription(`
                    **Customer ID:** ${payload.customer_id}\n
                    **Email:** ${payload.customer_email}\n
                    **IP Address:** ${payload.ip} (\`${
		payload.is_vpn_or_proxy ? "VPN" : "Not VPN"
	}\`)
                    **Store:** ${store.name} (${payload.name})\n
                    **Redeemed:** ${
						redeemedAt
							? `<t:${redeemedAt.getUTCMilliseconds()}:R>`
							: "`Not Redeemed`"
					}\n
                    **Products:** ${payload.products
						.map(
							(p: any) =>
								`\n* \`${
									parseInt(
										p.title.match(/^\d+/)?.[0] || "1"
									) * getOrDefault(p, "unit_quantity", 1)
								}x ${p.title.replace(/^\d+x?\s/, "")}\``
						)
						.join("")}}
                `);
	const message = await existingTicket.send({
		content: `||${store.disputePing}<@${discordId}>||`,
		embeds: [disputeMsg]
	});
	await message.pin();
	await channel.send({ embeds: [disputeMsg] });
};

/**
 * {
  id: 1141843,
  uniqid: 'dummy',
  recurring_billing_id: null,
  payout_configuration: null,
  secret: null,
  type: 'PRODUCT',
  subtype: null,
  origin: null,
  total: 0,
  total_display: 0,
  product_variants: null,
  exchange_rate: 0,
  crypto_exchange_rate: 0,
  currency: 'USD',
  shop_id: 0,
  shop_image_name: null,
  shop_image_storage: null,
  shop_cloudflare_image_id: null,
  name: 'vitalityw10',
  customer_email: 'dummy@dummy.com',
  customer_id: null,
  affiliate_revenue_customer_id: null,
  paypal_email_delivery: false,
  product_id: 'dummy',
  product_title: 'Dummy Product',
  product_type: 'SERIALS',
  subscription_id: null,
  subscription_time: null,
  gateway: null,
  blockchain: null,
  paypal_apm: null,
  stripe_apm: null,
  paypal_email: null,
  paypal_order_id: null,
  paypal_payer_email: null,
  paypal_fee: 0,
  paypal_subscription_id: null,
  paypal_subscription_link: null,
  lex_order_id: null,
  lex_payment_method: null,
  paydash_paymentID: null,
  virtual_payments_id: null,
  stripe_client_secret: null,
  stripe_price_id: null,
  skrill_email: null,
  skrill_sid: null,
  skrill_link: null,
  perfectmoney_id: null,
  binance_invoice_id: null,
  binance_qrcode: null,
  binance_checkout_url: null,
  crypto_address: null,
  crypto_amount: 0,
  crypto_received: 0,
  crypto_uri: null,
  crypto_confirmations_needed: 1,
  crypto_scheduled_payout: false,
  crypto_payout: 0,
  crypto_wallet_version: '01/01/2020',
  fee_billed: true,
  bill_info: null,
  cashapp_qrcode: null,
  cashapp_note: null,
  cashapp_cashtag: null,
  square_payment_id: null,
  country: null,
  location: ',  ()',
  ip: null,
  is_vpn_or_proxy: false,
  user_agent: null,
  quantity: 1,
  coupon_id: null,
  custom_fields: { discord_user: 'tomsoz#0', discord_id: '724833136894279690' },
  developer_invoice: false,
  developer_title: null,
  developer_webhook: null,
  developer_return_url: null,
  status: 'VOIDED',
  status_details: null,
  void_details: null,
  discount: 0,
  fee_percentage: 0,
  fee_breakdown: null,
  discount_breakdown: null,
  day_value: 1,
  day: 'Mon',
  month: 'Jan',
  year: 2020,
  product_addons: null,
  bundle_config: null,
  created_at: 1577836800,
  updated_at: 0,
  updated_by: 0,
  product_plan_id: null,
  approved_address: null,
  serials: [],
  locked_serials: [],
  ip_info: null,
  webhooks: [],
  rewards_data: [],
  paypal_dispute: null,
  product_downloads: [],
  payment_link_id: null,
  cashapp_email_configured: false,
  license: false,
  status_history: [
    {
      id: 2166538,
      invoice_id: 'dummy',
      status: 'VOIDED',
      details: 'The invoice has been voided: we have not received a payment within the time limit.',
      created_at: 1605114081
    }
  ],
  aml_wallets: [],
  crypto_transactions: [],
  product: {
    uniqid: 'dummy',
    title: 'Dummy Product',
    redirect_link: null,
    description: 'this is a real dummy product.. or is it?',
    price_display: 15,
    currency: 'USD',
    image_name: null,
    image_storage: null,
    pay_what_you_want: 0,
    affiliate_revenue_percent: -1,
    cloudflare_image_id: null,
    label_singular: null,
    label_plural: null,
    feedback: { total: 0, positive: 0, neutral: 0, negative: 0, list: [] },
    average_score: null,
    type: 'DYNAMIC',
    rcon_execution_type: 'AUTOMATIC',
    id: 0,
    shop_id: 0,
    price: 0,
    quantity_min: 0,
    quantity_max: 0,
    quantity_warning: 0,
    gateways: [ null ],
    crypto_confirmations_needed: 0,
    max_risk_level: 0,
    block_vpn_proxies: false,
    private: false,
    stock: 0,
    unlisted: false,
    sort_priority: 0,
    created_at: 0,
    updated_at: 0,
    updated_by: 0
  },
  total_conversions: {
    CAD: 0,
    HKD: 0,
    ISK: 0,
    PHP: 0,
    DKK: 0,
    HUF: 0,
    CZK: 0,
    GBP: 0,
    RON: 0,
    SEK: 0,
    IDR: 0,
    INR: 0,
    BRL: 0,
    RUB: 0,
    HRK: 0,
    JPY: 0,
    THB: 0,
    CHF: 0,
    EUR: 0,
    MYR: 0,
    BGN: 0,
    TRY: 0,
    CNY: 0,
    NOK: 0,
    NZD: 0,
    ZAR: 0,
    USD: 0,
    MXN: 0,
    SGD: 0,
    AUD: 0,
    ILS: 0,
    KRW: 0,
    PLN: 0,
    crypto: {
      BTC: '0.0000000000',
      DOGE: '0.0000000000',
      BNB: '0.0000000000',
      ETH: '0.0000000000',
      LTC: '0.0000000000',
      BCH: '0.0000000000',
      NANO: '0.0000000000',
      XMR: '0.0000000000',
      SOL: '0.0000000000',
      XRP: '0.0000000000',
      CRO: '0.0000000000',
      USDC: '0.0000000000',
      USDC_NATIVE: '0.0000000000',
      USDT: '0.0000000000',
      TRX: '0.0000000000',
      CCD: '0.0000000000',
      MATIC: '0.0000000000',
      APE: '0.0000000000',
      PEPE: '0.0000000000',
      DAI: '0.0000000000',
      WETH: '0.0000000000',
      SHIB: '0.0000000000',
      PYTH: '0.0000000000',
      BONK: '0.0000000000',
      JUP: '0.0000000000',
      JITO: '0.0000000000',
      WEN: '0.0000000000',
      RENDER: '0.0000000000',
      HNT: '0.0000000000',
      MOBILE: '0.0000000000',
      BCCOIN: '0.0000000000',
      BTCLN: '0.0000000000'
    },
    BTC: '0.0000000000',
    DOGE: '0.0000000000',
    BNB: '0.0000000000',
    ETH: '0.0000000000',
    LTC: '0.0000000000',
    BCH: '0.0000000000',
    NANO: '0.0000000000',
    XMR: '0.0000000000',
    SOL: '0.0000000000',
    XRP: '0.0000000000',
    CRO: '0.0000000000',
    USDC: '0.0000000000',
    USDC_NATIVE: '0.0000000000',
    USDT: '0.0000000000',
    TRX: '0.0000000000',
    CCD: '0.0000000000',
    MATIC: '0.0000000000',
    APE: '0.0000000000',
    PEPE: '0.0000000000',
    DAI: '0.0000000000',
    WETH: '0.0000000000',
    SHIB: '0.0000000000',
    PYTH: '0.0000000000',
    BONK: '0.0000000000',
    JUP: '0.0000000000',
    JITO: '0.0000000000',
    WEN: '0.0000000000',
    RENDER: '0.0000000000',
    HNT: '0.0000000000',
    MOBILE: '0.0000000000',
    BCCOIN: '0.0000000000',
    BTCLN: '0.0000000000'
  },
  theme: 'light',
  dark_mode: null,
  crypto_mode: null,
  ui_style_configuration: false,
  products: [
    {
      uniqid: 'dummy',
      title: 'Dummy Product',
      redirect_link: null,
      description: 'this is a real dummy product.. or is it?',
      price_display: '15.00',
      currency: 'USD',
      image_name: null,
      image_storage: null,
      pay_what_you_want: 0,
      affiliate_revenue_percent: -1,
      cloudflare_image_id: null,
      label_singular: null,
      label_plural: null,
      feedback: [Object],
      average_score: null,
      type: 'DYNAMIC',
      rcon_execution_type: 'AUTOMATIC'
    }
  ],
  gateways_available: [
    'BITCOIN',
    'ETHEREUM',
    'LITECOIN',
    'BITCOIN_CASH',
    'MONERO',
    'PAYPAL',
    'PERFECT_MONEY',
    'SKRILL'
  ],
  shop_payment_gateways_fees: [],
  shop_paypal_credit_card: false,
  shop_force_paypal_email_delivery: false,
  shop_walletconnect_id: null,
  rates_snapshot: {
    id: 1,
    USD: '1.0000',
    CAD: '1.4005',
    HKD: '7.7817',
    ISK: '137.5896',
    PHP: '58.6190',
    DKK: '7.0615',
    HUF: '391.8910',
    CZK: '23.9190',
    GBP: '0.7869',
    RON: '4.7119',
    SEK: '10.9198',
    IDR: '15858.0000',
    INR: '84.5971',
    BRL: '5.9712',
    RUB: '106.0066',
    HRK: '7.1333',
    JPY: '150.1798',
    THB: '34.2520',
    CHF: '0.8811',
    EUR: '0.9469',
    MYR: '4.4450',
    BGN: '1.8515',
    TRY: '34.7003',
    CNY: '7.2426',
    NOK: '11.0556',
    NZD: '1.6905',
    ZAR: '18.0666',
    MXN: '20.2651',
    SGD: '1.3406',
    AUD: '1.5351',
    ILS: '3.6357',
    KRW: '1398.3985',
    PLN: '4.0657',
    created_at: 0,
    updated_at: 1732896005,
    '': 1732897216,
    BTC: '97930.00000000',
    BITCOIN: '97930.00000000',
    DOGE: '0.41681140',
    DOGECOIN: '0.41681140',
    BNB: '658.396564710620',
    BINANCE_COIN: '658.396564710620',
    ETH: '3593.71000000',
    ETHEREUM: '3593.71000000',
    LTC: '101.27000000',
    LITECOIN: '101.27000000',
    BCH: '513.37000000',
    BITCOIN_CASH: '513.37000000',
    NANO: '1.40323139',
    XMR: '157.20000000',
    MONERO: '157.20000000',
    SOL: '242.80000000',
    SOLANA: '242.80000000',
    XRP: '1.69635000',
    RIPPLE: '1.69635000',
    CRO: '0.18592195',
    CRONOS: '0.18592195',
    USDC: '1.00',
    USDC_NATIVE: '1.00000000',
    USDT: '1.001200000000',
    TRX: '0.204994000000',
    TRON: '0.204994000000',
    CCD: '0.003414561033',
    CONCORDIUM: '0.003414561033',
    MATIC: '0.56910000',
    POLYGON: '0.56910000',
    APE: '1.397900000000',
    PEPE: '0.000020481000',
    DAI: '0.999870000000',
    WETH: '3614.369037617100',
    SHIB: '0.000025840000',
    PYTH: '0.473800000000',
    BONK: '0.000046905000',
    JUP: '1.146460000000',
    JITO: '3.652660000000',
    WEN: '0.000149400000',
    RENDER: '6.617100000000',
    HNT: '6.517000000000',
    MOBILE: '0.000816063512',
    BCCOIN: '0.252493725873'
  },
  void_times: [
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] },
    { gateways: [Array], conf: [Object] }
  ]
}
 */
