export class UrlProvider {
    constructor() {
      this.domainUrl = '';
      this.init();
    }
    init() {
      this.domainUrl = process.env.REACT_APP_API_URL;
      if (!this.domainUrl) {
        console.error(
          'ERROR: Unable to load domain url');
      }
      console.info(`Successfully loaded urls: ${ this.domainUrl }`);
    }
    
    getDomainUrl() {
      return this.domainUrl;
    }
   
  }