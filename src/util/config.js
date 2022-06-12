let config = {}
console.log('Environment:::', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    config = {
        API_BASE_URL: 'https://home.wagedev.com:8443/admin/',
        //http://159.100.208.43/wage
        image_url:'https://home.wagedev.com:8443',
        LANGUAGE: 'EN',
        web_url:'https://wageapp.io/',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
}
else if (process.env.NODE_ENV === 'sandbox') {
    config = {
        API_BASE_URL: 'https://home.wagedev.com:8443/admin/',
        image_url:'https://home.wagedev.com:8443',
        LANGUAGE: 'EN',
        web_url:'https://wageapp.io/',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
}
else {
    //https://admin.wagedev.com/ https://home.wagedev.com:8443/admin/ http://localhost:3005/admin/
    config = {
        API_BASE_URL: 'https://home.wagedev.com:8443/admin/',
        image_url:'https://home.wagedev.com:8443',
        LANGUAGE: 'EN',
        web_url:'https://wageapp.io/',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
}

export default config;