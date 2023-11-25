import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            isConnected: false,
        };
    }

    render() {
        const renderButton = (title, iconName, onPress) => (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <View style={styles.buttonContainer}>
                    <Icon name={iconName} color="white" size={20} style={styles.icon}/>
                    <Text style={styles.buttonText}>{title}</Text>
                </View>
            </TouchableOpacity>
        );

        return (
            <>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Welcome to Shazalcohol 🍇</Text>
                    {this.props.route.params?.username ? (
                        <Text style={styles.text}>{ '✨ ' + this.props.route.params.username + ' ✨'}</Text>
                    ) : null }
                </View>
                <View style={styles.container}>
                    {this.props.route.params?.isConnected ? null : (
                        renderButton('Connect to your account', 'account-circle', () =>
                            this.props.navigation.navigate('ConnexionPage')
                        )
                    )}
                    {renderButton('Take a picture', 'camera-alt', () =>
                        this.props.navigation.navigate('Scanner', {isAdmin: this.state.isAdmin})
                    )}
                    {renderButton('See the wines', 'local-bar', () =>
                        this.props.navigation.navigate('WineList', {isAdmin: this.state.isAdmin})
                    )}
                    {this.state.isAdmin &&
                        renderButton('Switch to user mode', 'person', () => this.setState({isAdmin: false}))}
                    {!this.state.isAdmin &&
                        renderButton('Switch to admin mode', 'shield', () => this.setState({isAdmin: true}))}
                    {this.props.route.params?.isConnected ? <>
                        {renderButton('Logout', 'logout', () =>
                            this.props.navigation.navigate('HomePage', {
                                isConnected: false,
                                isAdmin: false,
                            })
                        )}
                    </> : null}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    textContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 30,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 250,
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default HomePage;
