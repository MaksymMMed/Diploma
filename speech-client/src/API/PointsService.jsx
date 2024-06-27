import axios from "axios";
import Cookies from "js-cookie";

export class PointsService {
  constructor() {
    this.pointsApiPy = "http://127.0.0.1:5000/";
    this.pointsApiApiAsp = "https://localhost:7114/api/Point/";

    this.token = Cookies.get('jwtToken');
    this.config = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  async SendAudio(text, audioBlob) {
    try {
      const formData = new FormData(); 
      formData.append('text', text);
      formData.append('audio', audioBlob);
  
      const response = await axios.post(`${this.pointsApiPy}Recognize`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      return response; 
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async CreatePoints(text,points){
    try {

      const model = {
        points: points,
        textToSay: text,
      };

      const response = await axios.post(`${this.pointsApiApiAsp}add-point`, model,this.config);
      return response;
    } catch (error) {
      return error.response
    }
  }

  async ReadPoints(){
    try {
      const response = await axios.get(`${this.pointsApiApiAsp}read-user-points`, this.config);
      return response;
    } catch (error) {
      return error.response
    }
  }
}
