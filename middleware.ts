import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BOT_AGENTS = [
    'googlebot',
    'bingbot',
    'yandex',
    'duckduckbot',
    'baiduspider',
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkshare',
    'facebot',
    'outbrain',
    'w3c_validator',
];

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
    const isBot = BOT_AGENTS.some((bot) => userAgent.includes(bot));

    const response = NextResponse.next();

    // Bot ise özel bir header ekle (Client Component'ler bunu okuyup gereksiz animasyon vb kısıtlayabilir)
    if (isBot) {
        response.headers.set('X-Is-Bot', 'true');
    }

    return response;
}

export const config = {
    // Sadece sayfa rotalarında çalışsın, api, _next ve statik dosyalarda çalışmasın
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
