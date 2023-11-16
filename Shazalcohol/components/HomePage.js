import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

class HomePage extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 10 }} />
                <Button
                    title="Connect to your account"
                    onPress={() =>
                        this.props.navigation.navigate('ConnexionPage')
                    }
                />
                <View style={{ marginBottom: 10 }} />
                <Button
                    title="Take a picture"
                    onPress={() =>
                        this.props.navigation.navigate('Scanner')
                    }
                />
                <View style={{ marginBottom: 10 }} />
                <Button
                    title="See the wines"
                    onPress={() =>
                        this.props.navigation.navigate('WineList')
                    }
                />
                <View style={{ marginBottom: 10 }} />
                <Button
                    title="Test the server"
                    onPress={() =>
                        this.props.navigation.navigate('TestRequest')
                    }
                />
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