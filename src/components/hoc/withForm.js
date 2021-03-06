import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as log from '../../store/actions/fetch'; 


const withForm = (WrappedComponent) => {
  class HOC extends Component {
    constructor(props) {
        super(props);
    this.initialState = {
        form: {
            email: {
                id: 'email',
                value: '',
                valid: false,
                placeholder: 'Email',
                className: '',
                method: 'emailInputChange',
                error: 'Please provide a valid email'

            },
            username: {
                id: 'username',
                value: '',
                valid: false,
                placeholder: 'Username',
                method: 'usernameInputChange',
                error: 'Username must be lowercase and minimum 8 caracters long'

            },
            password: {
                id: 'password',
                value: '',
                valid: false,
                placeholder: 'Password',
                method: 'passwordInputChange',
                error: 'Password must be minimum 5 caracters long'

            },
            repeatPassword: {
                id: 'repeatPassword',
                value: '',
                valid: false,
                placeholder: 'Repeat password',
                method: 'repeatPasswordInputChange',
                error: 'Repeated password and password are not the same'

            }
        },
        loginError: false,
        isLoginPage: false,
        userLoggedIn: false
        
    }


    this.state = this.initialState
}

componentDidMount(){
this.props.onLogout();
return this.props.location.pathname=="/login" ? this.setState({isLoginPage: true}) : null;
}

emailInputChange = (e) => {
const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const isValid = pattern.test(e.target.value);
this.setState({
    form: {
        ...this.state.form,
        email: {
            ...this.state.form.email,
            value: e.target.value,
            valid: isValid
        }
    }
     
})
}
usernameInputChange = (e) => {
const isValid = e.target.value.length >= 8 && e.target.value == e.target.value.toLowerCase()
this.setState({
    form: {
        ...this.state.form,
        username: {
            ...this.state.form.username,
            value: e.target.value,
            valid: isValid
        }
    }
})
}
passwordInputChange = (e) => {
const isValid =  e.target.value.length >= 5
const repeatValid = isValid && this.state.form.repeatPassword.value == e.target.value
this.setState({
    form: {
        ...this.state.form,
        password: {
            ...this.state.form.password,
            value: e.target.value,
            valid: isValid
        },
        repeatPassword: {
            ...this.state.form.repeatPassword,
            valid: repeatValid
        }
    } 
})
}
repeatPasswordInputChange = (e) => {
const isValid = e.target.value === this.state.form.password.value ;
this.setState({
    form: {
        ...this.state.form,
        repeatPassword: {
            ...this.state.form.repeatPassword,
            value: e.target.value,
            valid: isValid
        }
    } 
})
}

checkIfFormIsValid = () => {
let validFields = [];
for(let field in this.state.form){
    
    validFields.push(this.state.form[field].valid)
  }
  return validFields.filter(item => !item).length == (this.state.isLoginPage ? 2 : 0) ? true : false;
}


registerHandler = (e) => {
e.preventDefault();

if (this.checkIfFormIsValid()) {
    // var existing = localStorage.getItem('user');
    // existing = existing ? JSON.parse(existing) : [];
    // existing.push({email:this.state.form.email, username:this.state.form.username, password:this.state.form.password});
    // localStorage.setItem('user', JSON.stringify(existing));

    localStorage.setItem(this.state.form.email.value, JSON.stringify(this.state.form));
   
    this.setState(() => ({
        ...this.state,
        form: this.initialState.form,
        isLoginPage: true
    }))


    }
}

loginHandler = (e) => {
e.preventDefault();

if (this.checkIfFormIsValid()) {
   let user = localStorage.getItem(this.state.form.email.value);
   
   if(user){
    user = JSON.parse(user);
    console.log(user)
    this.props.onLogin(user);
    this.setState({
        ...this.state,
        form: this.initialState.form,
        loginError: null,
        userLoggedIn: user
    })
    const page = user.email.value=='admin@admin.com' && user.password.value=='admin' ? '/admin' : '/home';
    this.props.history.push(page);
} 
   else {
    this.setState({
        ...this.state,
        form: this.initialState.form,
        loginError: 'Username or password is wrong',
        userLoggedIn: false
    })
   }
//    this.props.history.push('/login');
    
    }
}

    // componentDidMount(){
    //   console.log(this.props.user)
    //   if(!this.props.user){
    //     this.props.history.push('/login');
    //   }
    // }

    render() {
      return <WrappedComponent 
      formState={this.state}
      loginHandler={this.loginHandler}
      registerHandler={this.registerHandler}
      checkIfFormIsValid={this.checkIfFormIsValid}
      repeatPasswordInputChange={this.repeatPasswordInputChange}
      passwordInputChange={this.passwordInputChange}
      usernameInputChange={this.usernameInputChange}
      emailInputChange={this.emailInputChange}
      {...this.props} />;
    }
  }

const mapStateToProps = state => {
  return {
      stories: state.stories,
      comments: state.comments,
      loading: state.loading ,
      user: state.userLoggedIn
  };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (user) => dispatch(log.login(user)),
        onLogout: () => dispatch(log.logout())
    }
}

return connect(mapStateToProps, mapDispatchToProps)(HOC);
};
export default withForm;