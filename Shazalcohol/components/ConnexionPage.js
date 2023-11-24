import React from 'react';
import { Button, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
const SHA256 = require("crypto-js/sha256");

class ConnexionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    sendAccountConnexionRequest = async url => {
        try {
            const response = await fetch('http://82.66.48.233:42690/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: SHA256(this.state.password).toString(),
                }),
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.response === "true") {
                    alert('You successfully logged in, congrats !');
                    const usernameFormatted = responseData && responseData.username ? responseData.username : 'Unknown reason';
                    await this.props.navigation.navigate('HomePage', {isConnected: true, username: usernameFormatted});
                } else {
                        alert("Account connexion failed\nReason: Wrong username or password");
                }
            } else {
                alert('Account connexion failed (Error code :' + response.status + '\nReason: ' + response.statusText +
                    '\nPlease try again.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Username or email address"
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
                <Button
                    style={styles.button}
                    title="Connexion"
                    onPress={() => {
                        this.sendAccountConnexionRequest();
                    }}
                />
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('CreateAccountPage') }}>
                    <Text style={styles.createAccountText}>Don't have an account? Click here</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
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
    createAccountText: {
        marginTop: 10,
        color: 'blue',
    },
});

export default ConnexionPage;
