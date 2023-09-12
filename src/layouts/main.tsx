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

					<script src="/public/core.js"></script>
					{/* TODO: Move iconify into bundle */}
					<script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>
					<script async src="https://analytics.umami.is/script.js" data-website-id={process.env.UMAMI_TRACKING_CODE}></script>
				</body>
			</html>
		</>
	)
};

export default BaseHtml;