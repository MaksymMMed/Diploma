import axios from "axios";
import Cookies from "js-cookie";

export class UserService {
  constructor() {
    this.identityApiAsp = "https://localhost:7114/api/Account/";
    this.token = Cookies.get('jwtToken');
    this.config = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  async SignUp(email,username,password) {
    try {

      const signUpData = {
        username: username,
        email: email,
        password: password
      };

      const response = await axios.post(`${this.identityApiAsp}sign-up`, signUpData);
      return response;
    } catch (error) {
      return error.response
    }
  }

  async SignIn(email,password) {
    try {

      const signInData = {
        email: email,
        password: password
      };

      const response = await axios.post(`${this.identityApiAsp}sign-in`, signInData);
      return {data:response.data,status:response.status};
    } catch (error) {
      return error.response
    }
  }

  async GetUserInfo() {
    try {
      const response = await axios.get(`${this.identityApiAsp}get-user-info`,this.config);
      return {data:response.data,status:response.status};
    } catch (error) {
      return error.response
    }
  }
}
