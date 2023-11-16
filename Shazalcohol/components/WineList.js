import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class WineList extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>This is a list of wines :</Text>
                <Button
                    title="See wine 1 details"
                    onPress={() =>
                        this.props.navigation.navigate('WineScreen')
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

export default WineList;