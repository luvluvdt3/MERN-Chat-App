import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { userRegister } from '../store/actions/authAction';
import { useAlert } from 'react-alert'
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from '../store/types/authType';

const Register = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const { loading, authenticate, error, successMessage, myInfo } = useSelector(state => state.auth); //get states from authReducer.js through src/index.js
  console.log(myInfo);


  const dispatch = useDispatch()
  const [state, setstate] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: ''
  })

  const [loadImage, setLoadImage] = useState(''); //just a normal vars, not any package [varName, setterFunctionName]

  const inputHandle = e => { //for text input
    setstate({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const fileHandle = e => { //for images
    if (e.target.files.length !== 0) {
      setstate({
        ...state,
        [e.target.name]: e.target.files[0]
      })
    }

    const reader = new FileReader(); //JS has this by default wooot
    reader.readAsDataURL(e.target.files[0]); //turn the img into URL to be able to read its src
    reader.onload = () => { //every time reader changes, update the var LoadImage
      setLoadImage(reader.result)
    }
  }

  const register = e => {
    e.preventDefault();
    const { userName, email, password, confirmPassword, image } = state; //can declare many variables from state like this
    const formData = new FormData()
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('image', image);
    dispatch(userRegister(formData)) //execute the function in store/actions/authActions
    console.log(state);
  }

  useEffect(() => {
    if (authenticate) { //if is logged in
      navigate('/');    //make user go to the main page  
      //just in case wanna avoid this, can log out or delete the authToken in console->application
    }
    if (successMessage) { //if there is success message in the Redux state
      alert.success(successMessage);
      dispatch({type : SUCCESS_MESSAGE_CLEAR }) //type is the name of the Redux that contains all the state coming along with it(in Console->Redux)
      //In the authReducer will remove successMessage
    }
    if (error) {
      error.map(err => alert.error(err)); //have to use .map since there can be plusieurs errors
      dispatch({type : ERROR_CLEAR })
    }
  }, [successMessage, error])

  return (
    <div className='register'>
      <div className='card'>
        <div className='card-header'>
          <h3>Register</h3>
        </div>

        <div className='card-body'>
          <form onSubmit={register}>
            <div className='form-group'>
              <label htmlFor='username'>User Name</label>
              <input type="text" onChange={inputHandle} name="userName" value={state.userName} className='form-control' placeholder='User Name' id='username' />
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type="email" onChange={inputHandle} name="email" value={state.email} className='form-control' placeholder='Email' id='email' />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type="password" onChange={inputHandle} name="password" value={state.password} className='form-control' placeholder='Password' id='password' />
            </div>


            <div className='form-group'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input type="password" onChange={inputHandle} name="confirmPassword" value={state.confirmPassword} className='form-control' placeholder='Confirm Password' id='confirmPassword' />
            </div>

            <div className='form-group'>
              <div className='file-image'>
                <div className='image'>
                  {loadImage ? <img src={loadImage} /> : ''}
                  {/* if loadImage variable exists, display it as src of img, or else display '' (none) */}
                </div>
                <div className='file'>
                  <label htmlFor='image'>Select Image</label>
                  <input type="file" onChange={fileHandle} name="image" className='form-control' id='image' />
                </div>

              </div>
            </div>

            <div className='form-group'>
              <input type="submit" value="register" className='btn' />
            </div>


            <div className='form-group'>
              <span><Link to="/messenger/login"> Login Your Account </Link></span>
            </div>
          </form>
        </div>


      </div>

    </div>

  )
};

export default Register;