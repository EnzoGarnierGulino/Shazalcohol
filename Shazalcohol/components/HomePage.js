import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            isConnected: false,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.route.params?.isConnected ? (
                    <Text>Welcome {this.props.route.params.username} !</Text>
                ) : (
                    <Button
                        title="Connect to your account"
                        onPress={() => this.props.navigation.navigate('ConnexionPage')}
                    />
                )}
                <View style={{ marginBottom: 10 }} />
                <Button
                    title="Take a picture"
                    onPress={() =>
                        this.props.navigation.navigate('Scanner', {isAdmin: this.state.isAdmin})
                    }
                />
                <View style={{ marginBottom: 10 }} />
                <Button
                    title="See the wines"
                    onPress={url =>
                        this.props.navigation.navigate('WineList', {isAdmin: this.state.isAdmin})
                    }
                />
                <View style={{ marginBottom: 10 }} />
                    {this.state.isAdmin ? (
                        <View>
                            <Button
                                title="Test the server"
                                onPress={() => this.props.navigation.navigate('TestRequest')}
                            />
                            <View style={{ marginBottom: 10 }} />
                            <Button
                                title="Switch to user mode"
                                onPress={() => this.setState({ isAdmin: false })}
                            />
                        </View>
                    ) : (
                        <Button
                            title="Switch to admin mode"
                            onPress={() => this.setState({ isAdmin: true })}
                        />
                    )}
            </View>
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
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
});

export default HomePage;