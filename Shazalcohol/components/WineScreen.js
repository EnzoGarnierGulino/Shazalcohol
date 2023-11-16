import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

class WineScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>C'est le vin rouge 1</Text>
                <Text>Il est très bon</Text>
                <Image source={require('../images/Wine1.png')} style={styles.image} />
                <Text>Noté 4/5</Text>
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
    image: {
        width: 400,
        height: 400,
    },
});

export default WineScreen;