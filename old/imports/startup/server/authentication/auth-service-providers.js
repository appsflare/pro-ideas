import { BaseAuthServiceProvider } from './base-auth-service-provider';

export class FacebookAuthServiceProvider extends BaseAuthServiceProvider {
    constructor() {
        super('facebook');
    }

    configure() {
        ServiceConfiguration.configurations.upsert(
            { service: this.serviceProviderName },
            {
                $set: {
                    appId: process.env.FACEBOOK_CLIENTID,
                    loginStyle: process.env.LOGIN_STYLE,
                    secret: process.env.FACEBOOK_CLIENTSECRET
                }
            });
    }
}


export class GoogleAuthServiceProvider extends BaseAuthServiceProvider {
    constructor() {
        super('google');
    }

    configure() {
        ServiceConfiguration.configurations.upsert(
            { service: this.serviceProviderName },
            {
                $set: {
                    clientId: process.env.GOOGLE_CLIENTID,
                    loginStyle: 'redirect',
                    clientSecret: process.env.GOOGLE_CLIENTSECRET
                }
            });
    }
}

export class GitHubAuthServiceProvider extends BaseAuthServiceProvider {
    constructor() {
        super('github');
    }

    configure() {
        ServiceConfiguration.configurations.upsert(
            { service: this.serviceProviderName },
            {
                $set: {
                    clientId: process.env.GITHUB_CLIENTID,
                    loginStyle: process.env.LOGIN_STYLE,
                    clientSecret: process.env.GITHUB_CLIENTSECRET
                }
            });
    }
}