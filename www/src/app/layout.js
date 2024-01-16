import Head from 'next/head'

import Script from 'next/script'

import './globals.scss'
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
// const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

export const metadata = {
  metadataBase: new URL('https://ukulake.amazyyy.com'),
  alternates: {
    'shortcut icon': '/icons/favicon.ico',
    'mask-icon': {
      href: '/icons/safari-pinned-tab.svg',
      color: '#289488'
    },
    manifest: '/icons/site.webmanifest'
  },
  openGraph: {
    title: 'Ukulake Tabs/Songs',
    description: 'Built by a software engineer who recently have hard time finding tabs or song books for ukulele for free.',
    url: 'https://ukulake.amazyyy.com',
    siteName: 'Ukulake',
    themeColor: '#289488',
    images: [
      {
        url: '/images/hero.png',
        width: 1148,
        height: 437
      }
    ],
    locale: 'en_US'
  }
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <Script strategy='afterInteractive' id='gh4-1' src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        strategy='afterInteractive' id='gh4-2' dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){
              dataLayer.push(arguments)
            }
            gtag('js', new Date());
  
            gtag('config', '${GA_TRACKING_ID}');
          `
        }}
      />
      <Script
        strategy='afterInteractive' id='crisp-1' dangerouslySetInnerHTML={{
          __html: `
            window.$crisp=[];window.CRISP_WEBSITE_ID="${CRISP_WEBSITE_ID}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
          `
        }}
      />

      <Head>
        <link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
        <link rel='manifest' href='/icons/site.webmanifest' />
        <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#289488' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <body className='select-none'>
        {children}
      </body>
    </html>
  )
}
