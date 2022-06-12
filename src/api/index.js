import axios from 'axios';
let baseURL;
if (process.env.NODE_ENV === 'production') {
   baseURL= 'http://3.135.227.18:8443/'
}else{
   baseURL= 'http://3.135.227.18:8443/'
}
export default
   axios.create({
      baseURL: baseURL
      // timeout: 2000
   });