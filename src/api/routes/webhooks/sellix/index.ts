import { Client } from "discord.js";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { config } from "../../../../config/config";
import { getDiscordClient } from "../../../../utils/discordClient";
import { sellixWebsocket } from "../../../middlewares/sellixWebsocket";

const router = Router();

// Path to the events folder
const eventsPath = path.join(__dirname, "events");

// Load all event handlers dynamically
const eventHandlers: Record<
	string,
	(payload: any, res: Response, store: any, client: Client) => void
> = {};
fs.readdirSync(eventsPath).forEach((file) => {
	if (file.endsWith(".ts") || file.endsWith(".js")) {
		const eventName = file.replace(/\.[tj]s$/, "").replace("-", ":"); // Remove extension
		eventHandlers[eventName] = require(path.join(eventsPath, file)).default;
	}
});

// Handle incoming Sellix webhooks
router.post("/", sellixWebsocket, async (req, res) => {
	const client = getDiscordClient();
	if (!client) {
		res.status(500).json({
			message: `Discord client is not initialized yet!`
		});
		return;
	}
	const eventType = req.headers["x-sellix-event"] as string;
	const payload = req.body.data;
	if (payload.uniqid === "dummy") {
		payload.name = "xaviiw10";
		payload.custom_fields = {
			discord_user: "tomsoz#0",
			discord_id: "724833136894279690"
		};
	}
	const store =
		payload.name.toLowerCase() in config.stores
			? config.stores[payload.name.toLowerCase()]
			: undefined;
	if (!store) {
		res.status(400).json({
			message: `That store is not configured!`
		});
		return;
	}

	if (eventHandlers[eventType]) {
		try {
			res.status(202).json({ message: "Processing request..." });
			// @ts-ignore
			await eventHandlers[eventType](payload, res, store, client); // Call the appropriate handler
			if (!res.statusCode) {
				res.status(200).json({
					message: `Handled Sellix event: ${eventType}`
				});
			}
		} catch (err) {
			console.error(`Error handling Sellix event: ${eventType}`, err);
			res.status(500).json({
				message: `Error handling event: ${eventType}`
			});
		}
	} else {
		console.warn(`No handler for Sellix event: ${eventType}`);
		res.status(400).json({ message: `No handler for event: ${eventType}` });
	}
});

export default router;

/**
 * {
  event: 'order:created',
  data: {
    id: 14865593,
    uniqid: 'b89f9c-feebb88033-412934',
    recurring_billing_id: null,
    payout_configuration: null,
    secret: 'GImOnfIibW9D6bC8QPD2Zz3CFCJT6THSbAm4WvIgDvczi91vu7NB0Go0D9vMBGS63YzM95yzjR7hj4S4pMd8iPVk14ZidWdPIYNO2ZEuee6NG4mR9tLNSO98Fq60wENX',
    type: 'PRODUCT',
    subtype: null,
    origin: 'STOREFRONT',
    total: 0,
    total_display: 0,
    product_variants: null,
    exchange_rate: 1,
    crypto_exchange_rate: 0,
    currency: 'USD',
    shop_id: 435794,
    shop_image_name: null,
    shop_image_storage: null,
    shop_cloudflare_image_id: null,
    name: 'Dros-Haven',
    customer_email: 'sellix@tomsoz.xyz',
    customer_id: 'cst_907303380a687fb1656fbf',
    affiliate_revenue_customer_id: null,
    paypal_email_delivery: false,
    product_id: '670bacd034ea4',
    product_title: 'Solo Ascension',
    product_type: 'SERVICE',
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
    crypto_wallet_version: null,
    fee_billed: true,
    bill_info: null,
    cashapp_qrcode: null,
    cashapp_note: null,
    cashapp_cashtag: null,
    square_payment_id: null,
    country: 'GB',
    location: 'Birkenhead, England (Europe/London)',
    ip: '90.200.4.204',
    is_vpn_or_proxy: false,
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
    quantity: 1,
    coupon_id: '6738d1ecb6d3f',
    custom_fields: { discord_user: 'tomsoz#0', discord_id: '724833136894279690' },
    developer_invoice: false,
    developer_title: null,
    developer_webhook: null,
    developer_return_url: null,
    status: 'COMPLETED',
    status_details: null,
    void_details: null,
    discount: 15,
    fee_percentage: 0,
    fee_breakdown: null,
    discount_breakdown: {
      log: [Object],
      tax: [Object],
      addons: [],
      coupon: [Object],
      tax_log: [Object],
      products: [],
      currencies: [Object],
      gateway_fee: [],
      price_discount: [],
      bundle_discounts: [],
      volume_discounts: [Object]
    },
    day_value: 24,
    day: 'Sun',
    month: 'Nov',
    year: 2024,
    product_addons: null,
    bundle_config: null,
    created_at: 1732420268,
    updated_at: 1732420270,
    updated_by: 0,
    product_plan_id: null,
    approved_address: null,
    service_text: 'Open a donation ticket to claim.\r\n',
    ip_info: {
      id: 14896262,
      request_id: 'SQeijuzdeF',
      ip: '90.200.4.204',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
      user_language: 'en-GB,en;q=0.5',
      fraud_score: 0,
      country_code: 'GB',
      region: 'England',
      city: 'Birkenhead',
      isp: 'Sky Broadband',
      asn: 5607,
      organization: 'Sky Broadband',
      latitude: '53.40000',
      longitude: '-3.03000',
      is_crawler: 0,
      timezone: 'Europe/London',
      mobile: 0,
      host: '90.200.4.204',
      proxy: 0,
      vpn: 0,
      tor: 0,
      active_vpn: 0,
      active_tor: 0,
      recent_abuse: 0,
      bot_status: 0,
      connection_type: 'Residential',
      abuse_velocity: 'none',
      operating_system: 'Windows 10',
      browser: 'Firefox 133.0',
      device_brand: 'N/A',
      device_model: 'N/A',
      created_at: 1731773990,
      updated_at: 0
    },
    webhooks: [ [Object], [Object] ],
    rewards_data: [],
    coupon_code: 'tomsoztesting',
    paypal_dispute: null,
    product_downloads: [],
    payment_link_id: null,
    cashapp_email_configured: false,
    license: false,
    status_history: [ [Object], [Object] ],
    aml_wallets: [],
    crypto_transactions: [],
    product: {
      uniqid: '670bacd034ea4',
      title: 'Solo Ascension',
      redirect_link: null,
      description: 'Level 180 Ascension',
      price_display: 15,
      currency: 'USD',
      image_name: null,
      image_storage: null,
      pay_what_you_want: 0,
      affiliate_revenue_percent: -1,
      cloudflare_image_id: null,
      label_singular: null,
      label_plural: null,
      feedback: [Object],
      average_score: '5.0000',
      type: 'SERVICE',
      rcon_execution_type: 'AUTOMATIC',
      id: 0,
      shop_id: 0,
      price: 0,
      quantity_min: 0,
      quantity_max: 0,
      quantity_warning: 0,
      gateways: [Array],
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
      crypto: [Object],
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
    dark_mode: 0,
    crypto_mode: 'DEFAULT',
    ui_style_configuration: false,
    products: [ [Object] ],
    gateways_available: [ 'PAYPAL' ],
    shop_payment_gateways_fees: [ [Object] ],
    shop_paypal_credit_card: true,
    shop_force_paypal_email_delivery: true,
    shop_walletconnect_id: null,
    rates_snapshot: {
      id: 9100,
      USD: '1.0000',
      CAD: '1.3981',
      HKD: '7.7839',
      ISK: '139.6804',
      PHP: '58.9390',
      DKK: '7.1583',
      HUF: '395.0004',
      CZK: '24.3262',
      GBP: '0.7981',
      RON: '4.7782',
      SEK: '11.0402',
      IDR: '15943.5500',
      INR: '84.4363',
      BRL: '5.8010',
      RUB: '104.3087',
      HRK: '7.1333',
      JPY: '154.7690',
      THB: '34.4804',
      CHF: '0.8936',
      EUR: '0.9599',
      MYR: '4.4680',
      BGN: '1.8768',
      TRY: '34.5728',
      CNY: '7.2430',
      NOK: '11.0684',
      NZD: '1.7141',
      ZAR: '18.1054',
      MXN: '20.4272',
      SGD: '1.3466',
      AUD: '1.5385',
      ILS: '3.7080',
      KRW: '1404.5104',
      PLN: '4.1635',
      created_at: 1732417205,
      updated_at: 0,
      '': 0,
      BTC: '98276.10000000',
      BITCOIN: '98276.10000000',
      DOGE: '0.44419190',
      DOGECOIN: '0.44419190',
      BNB: '658.726202783210',
      BINANCE_COIN: '658.726202783210',
      ETH: '3426.99000000',
      ETHEREUM: '3426.99000000',
      LTC: '101.78000000',
      LITECOIN: '101.78000000',
      BCH: '519.10000000',
      BITCOIN_CASH: '519.10000000',
      NANO: '1.29641682',
      XMR: '165.90000000',
      MONERO: '165.90000000',
      SOL: '258.11000000',
      SOLANA: '258.11000000',
      XRP: '1.47806000',
      RIPPLE: '1.47806000',
      CRO: '0.20022695',
      CRONOS: '0.20022695',
      USDC: '1.00',
      USDC_NATIVE: '1.00000000',
      USDT: '1.001200000000',
      TRX: '0.215345000000',
      TRON: '0.215345000000',
      CCD: '0.003363810982',
      CONCORDIUM: '0.003363810982',
      MATIC: '0.58980000',
      POLYGON: '0.58980000',
      APE: '1.378500000000',
      PEPE: '0.000020837000',
      DAI: '1.000120000000',
      WETH: '3430.475824316500',
      SHIB: '0.000027150000',
      PYTH: '0.444160000000',
      BONK: '0.000048700000',
      JUP: '1.160370000000',
      JITO: '3.667090000000',
      WEN: '0.000161980000',
      RENDER: '0.000000000000',
      HNT: '6.242100000000',
      MOBILE: '0.000650120157',
      BCCOIN: '0.277319942045'
    },
    void_times: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ]
  }
}
 */
