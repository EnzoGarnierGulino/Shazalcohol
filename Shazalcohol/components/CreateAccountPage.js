import React from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
const SHA256 = require("crypto-js/sha256");

class CreateAccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            validationPassword: '',
            firstName: '',
            lastName: '',
            mail: '',
        };
    }

    sendAccountCreationRequest = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/createAccount', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: SHA256(this.state.password).toString(),
                    validationPassword: SHA256(this.state.password).toString(),
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    mail: this.state.mail,
                }),
            });
            if (response.ok) {
                alert('Account successfully created!');
                await this.props.navigation.navigate('ConnexionPage');
            } else {
                const responseData = await response.json();
                const reason = responseData && responseData.reason ? responseData.reason : 'Unknown reason';
                alert(`Account creation failed (Error code: ${response.status})\nReason: ${reason}\nPlease try again.`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    validateAccountCreation() {
        if (this.state.username === '' || this.state.password === '' || this.state.validationPassword === ''
            || this.state.firstName === '' || this.state.lastName === '' || this.state.mail === '') {
            alert('Please fill all the fields');
            return false;
        }
        if (this.state.password !== this.state.validationPassword) {
            alert('Passwords do not match');
            return false;
        }
        if (this.state.password.length < 8 || !/[a-z]/.test(this.state.password) || !/[A-Z]/.test(this.state.password) || !/\d/.test(this.state.password)) {
            alert('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.state.mail)) {
            alert('Please enter a valid email address');
            return false;
        }
        return true;
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(username) => this.setState({ username })}
                    value={this.state.username}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    secureTextEntry={true}
                    onChangeText={(validationPassword) => this.setState({ validationPassword })}
                    value={this.state.validationPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="First name"
                    onChangeText={(firstName) => this.setState({ firstName })}
                    value={this.state.firstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    onChangeText={(lastName) => this.setState({ lastName })}
                    value={this.state.lastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    onChangeText={(mail) => this.setState({ mail })}
                    value={this.state.mail}
                />
                <Button
                    style={styles.button}
                    title="Create your account"
                    onPress={() => {
                        this.validateAccountCreation() ? this.sendAccountCreationRequest() : null
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        color: '#000',
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
    },
    button: {
        marginBottom: 10,
    },
});

export default CreateAccountPage;