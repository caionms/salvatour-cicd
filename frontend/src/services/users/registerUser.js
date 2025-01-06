import axios from "axios";
import { CADASTRO_ENDPOINT } from "../../constants/urls";

export function registerUser(name, email, password, city, state) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${CADASTRO_ENDPOINT}`, {
        name: name,
        email: email,
        password: password,
        city: city,
        state: state,
      })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
