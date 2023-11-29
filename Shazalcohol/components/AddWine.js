import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class AddWine extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>This is the page to add a wine</Text>
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

export default AddWine;