import React from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';

class ConnexionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

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
                <Button
                    style={styles.button}
                    title="Connexion"
                    onPress={() => {
                        console.log('Username:', this.state.username);
                        console.log('Password:', this.state.password);
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

export default ConnexionPage;