import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

let signin = async () => {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/api/auth/signin',
      data: {
        email: document.getElementById('username').value,
        password: document.getElementById('password').value
      }
    });
    console.log(response.data);
  }catch (error) {
    console.error(error);
  }
};
document.getElementById('signin').onclick=signin;