import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';

class WineList extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                {this.props.route.params.isAdmin && (
                    <View>
                        <Button
                            title="Add a wine"
                            onPress={() => this.props.navigation.navigate('AddWine')}
                        />
                    </View>
                )}
                <View style={{ marginBottom: 10 }} />
                <View style={{ width: '90%' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('WineScreen')}>
                        <Card>
                            <Card.Title>Wine 1 (2006)</Card.Title>
                            <Card.Divider />
                            <Text>Rouge</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
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
