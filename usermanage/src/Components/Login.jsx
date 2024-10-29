import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../Styles/Login.css'

function Login() {

    const navigate = useNavigate()
  const [loginData, setLoginData] = useState({
    email: 'ashish@gmail.com',
    password: '123456'
  });
  const [error, setError] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Make an API request using Axios
      // const response = await axios.post('https://vinoapi.winayak.com/api/login', loginData);

      // // Handle the API response here
      // console.log('API Response:', response.data.access_token);
        
      Cookies.set("token", "response?.data?.access_token")
      Cookies.set("status", true) 
      navigate("/")
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('API Error:', error);
    }
  };

  return (
    <div className='LoginPage'>
      <h2 className='LoginPage_Header'>Login</h2>
      {error && <p className='LoginPage_errorMessage'>{error}</p>}
        <form className='LoginPage_Form' onSubmit={handleSubmit}>
          <label className='Page_label'>Email:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            required
            className='Page_input'
          />
          <label className='Page_label'>Password:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
            className='Page_input'
          />
          <button type="submit" className='submit_Button'>Login</button>
        </form>
    </div>
  );
}

export default Login;
