export class BaseAuthServiceProvider {    

    constructor(serviceProviderName) {
        this.serviceProviderName = serviceProviderName;
    }

    configure(){

    }

    getUser(options, user) {

        //Modules.server.sendWelcomeEmail(user, profile);

        let details = this.getUserDetails(options, user);

        if (details.fullName) {
            let profile = options.profile;

            profile && (profile.fullName = details.fullName);

            user.profile = profile;
        }
        
        if (details.email) {
            user.emails = [{
                address: details.email,
                verified: false
            }];
        }

        return user;
    }

    getUserDetails(options, user) {
        let profile = options.profile;

        let fullName = profile && profile.name;

        let detailsFromService = this.getService(user);
        let email = detailsFromService && detailsFromService.email;

        return { fullName, email };
    }

    getService(user) {
        return (user && user.services && user.services[this.serviceProviderName]) || {};
    }

}