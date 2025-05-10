import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-kagou',
    version: '0.1.0',
    icon: '⛵',
    title: 'GPS location of Kagou',
    description: 'Get our trip location',
    author: 'Kagou',
    repository: '',
    desktopUI: 'embedded',
    mobileUI: 'fullscreen',
    routerPath: '/kagou',
};

export default config;
