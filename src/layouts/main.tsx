import html from '@kitajs/html'
import { Attributes } from "typed-html"

const BaseHtml = ({ children, ...attributes }: Attributes) => {
	const { title, navigation } = attributes;
	return (
		<>
			{`<!DOCTYPE html>`}
			<html lang="en" class="h-full bg-gray-100">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<title>{title}</title>
					<link href="/styles.css" rel="stylesheet" />
				</head>
				<body class="h-full">
					{/* TODO: Light/Dark switcher */}

					{children}

					<script src="https://unpkg.com/htmx.org@1.9.5"></script>
					<script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
					<script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>
					<script async src="https://analytics.umami.is/script.js" data-website-id="36d1f2c4-6e3b-46d0-96d5-b85191a0d810"></script>
					{`<script>
						(function(n,i,v,r,s,c,x,z){x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c };window[n]=function(c,p){x.q.push({ c: c, p: p });};z=document.createElement('script');z.async=true;z.src=s;document.head.insertBefore(z,document.head.getElementsByTagName('script')[0]);})(
						'cwr',
						'ed8aeea1-4749-497d-987b-6a56f90abc46',
						'1.0.0',
						'eu-west-1',
						'https://client.rum.us-east-1.amazonaws.com/1.14.0/cwr.js',
						{
							sessionSampleRate: 1,
							guestRoleArn: "arn:aws:iam::538196537053:role/RUM-Monitor-eu-west-1-538196537053-0787420544961-Unauth",
							identityPoolId: "eu-west-1:38b84f50-951b-4f24-ad55-90a5f5f24826",
							endpoint: "https://dataplane.rum.eu-west-1.amazonaws.com",
							telemetries: ["performance","errors","http"],
							allowCookies: true,
							enableXRay: false
						}
						);
					</script>`}
				</body>
			</html>
		</>
	)
};

export default BaseHtml;