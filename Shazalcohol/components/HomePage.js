import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import {serverIP, isConnectedG, isAdminG, userIdG, usernameG, hashpassG, setIsConnectedG} from "../App.js";
import {fontSize} from "nativewind/dist/tailwind/native/font-size";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.forceUpdate();
        });
    }

    render() {
        // Render a button with an icon and a title
        const renderButton = (title, iconName, onPress) => (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <View style={styles.buttonContainer}>
                    <Icon name={iconName} color="white" size={20} style={styles.icon}/>
                    <Text style={styles.buttonText}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
        return (
            // Depending on the state of the user, we display different buttons
            <>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Welcome to Shazalcohol 🍇</Text>
                    {isConnectedG ? (
                        <Text style={styles.text}>{ '✨ ' + usernameG + ' ✨'}</Text>
                    ) : null }
                </View>
                <View style={styles.container}>
                    {isConnectedG ? null : (
                        renderButton('Connect to your account', 'account-circle', () =>
                            this.props.navigation.navigate('ConnexionPage')
                        )
                    )}
                    {renderButton('Scan a barcode', 'camera-alt', () =>
                        this.props.navigation.navigate('Scanner')
                    )}
                    {renderButton('See the wines', 'local-bar', () =>
                        this.props.navigation.navigate('WineList')
                    )}
                    {isConnectedG ? <>
                        {renderButton('Logout', 'logout', () => {
                            setIsConnectedG(false);
                            this.forceUpdate();
                        }
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
