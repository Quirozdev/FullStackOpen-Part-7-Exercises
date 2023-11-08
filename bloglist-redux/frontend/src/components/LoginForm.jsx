import PropTypes from 'prop-types';

const LoginForm = ({
  handleLogin,
  usernameValue,
  handleUsernameChange,
  passwordValue,
  handlePasswordChange,
}) => {
  return (
    <form onSubmit={handleLogin} id="login-form">
      <h2>Log in to application</h2>
      <div>
        username{' '}
        <input
          type="text"
          id="username"
          name="username"
          value={usernameValue}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password{' '}
        <input
          type="password"
          id="password"
          name="password"
          value={passwordValue}
          onChange={handlePasswordChange}
        />
      </div>
      <button id="login-btn" type="submit">
        Login
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  usernameValue: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  passwordValue: PropTypes.string.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
};

export default LoginForm;
