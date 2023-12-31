import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import * as authApi from '@/api/auth';
import store from '@/reducers';

const Register = () => {
  // User information hook
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error] = useState('');

  const showLogin = async (_event) => {
    store.dispatch({ type: 'auth_setAuthPage', page: 'loginPage' });
  };
  // Function to call submit
  const callSubmit = async (e) => {
    // Prevents page reload on wrongs creds
    e.preventDefault();
    const registerForm = {
      fullName: firstName + ' ' + lastName,
      email: email,
      password: password,
      password_repeat: passwordConfirmation,
    };
    if (
      registerForm.password === '' ||
      registerForm.password !== registerForm.password_repeat
    ) {
      this.$message({
        content: 'Passwords do not match!',
        type: 'warn',
      }).show();
      return;
    }
    /* exclude password_repeat from registrationData */
    const { ...registrationData } = registerForm;

    authApi
      .register_user(registrationData)
      .then((response) => {
        if (response.status === 201) {
          /* After successful registration user is logged in */
          store.dispatch({
            type: 'auth_loggedIn',
            payload: {
              token: response.data.accessToken,
              user: response.data.user,
            },
          });
          /* set the otp secrets, should be deleted from state after showing QR code */
          store.dispatch({
            type: 'auth_setAuthSecrets',
            payload: {
              secret: response.data.otpSecret,
              uri: response.data.otpUri,
              qrSVG: response.data.otpQrSvg,
            },
          });
          /* then we show the QR code so that the user may save it */
          store.dispatch({
            type: 'auth_setAuthPage',
            page: process.env.REACT_APP_OTP_QR_PAGE,
          });
        }
      })
      .catch((_event) => {
        store.dispatch({ type: 'logOut' });
      });
  };

  return (
    <div className="login-container">
      <Container className="inner-container model rules auto-complete label-position">
        <Container className="title-container">
          <h2 className="title">{'IAS-Register'}</h2>
        </Container>
        <Form onSubmit={callSubmit}>
          <Form.Group controlId="formRegisterFirstname">
            <Form.Control
              type="text"
              placeholder="Firstname"
              value={firstName}
              onChange={(f) => setFirstName(f.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRegisterLastname">
            <Form.Control
              type="text"
              placeholder="Lastname"
              value={lastName}
              onChange={(l) => setLastName(l.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRegisterEmail">
            <Form.Control
              type="email"
              placeholder="Useremail"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRegisterPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(p) => setPassword(p.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRegisterPasswordConfirmation">
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={passwordConfirmation}
              onChange={(p) => setPasswordConfirmation(p.currentTarget.value)}
            />
          </Form.Group>
          <Alert
            variant="danger"
            style={error !== '' ? { display: 'block' } : { display: 'none' }}
          >
            {error}
          </Alert>
          <Button
            variant="primary"
            type="submit"
            block
            style={{
              width: '100%',
              height: '40px',
              color: 'white',
              marginBottom: '5px',
              marginTop: '5px',
              background: '#007bff',
              borderRadius: '2px',
            }}
          >
            Register
          </Button>
          <Button type="button" className="link-button" onClick={showLogin}>
            Switch to Login
          </Button>
        </Form>
      </Container>
    </div>
  );
};
export default Register;
