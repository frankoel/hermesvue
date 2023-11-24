import Vue from "vue";

export default {
  async getToken()
  {

      try {

          let data = {
              "email":"fj@gmail.com",
              "password":"LAQUESEA"
            }
      
          const response = await fetch(Vue.prototype.$urlhermes + '/auth/login', 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                      }), 
                      mode: 'cors', 
                      method: 'POST',
                      body: JSON.stringify(data),
                    });
          const res_json = await response.json()
          console.log(res_json)
          
          if(response.ok)
          {
            Vue.prototype.$token = res_json.token
            //console.log(res_json)
            //return res_json.token
          }

        } catch (error) {
          console.log("Error occurred:", error);
        }

  },
};

