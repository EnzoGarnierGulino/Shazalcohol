import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

class WineList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wines: [],
        };
    }

    componentDidMount() {
        this.fetchWines();
    }

    fetchWines = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/getAllWines?offset=0&winesPerPage=10', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                const bodyData = JSON.parse(responseData[0].body);
                this.setState({ wines: bodyData.wines });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    render(url) {
        const wineCards = this.state.wines && Array.isArray(this.state.wines) ? (
            this.state.wines.map((wine, index) => (
                <View key={index} style={{ width: '90%' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('WineScreen', {
                            wine: wine,
                            isAdmin: this.props.route.params.isAdmin
                        })}>

                    <Card>
                            <Card.Title>{wine.name + ' (' + wine.year + ')'}</Card.Title>
                            <Card.Divider />
                            <Text>{wine.type}</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
            ))
        ) : null;

        return (
            <ScrollView contentContainerStyle={styles.container}>
                {this.props.route.params.isAdmin && (
                    <View>
                        <Button
                            title="Add a wine"
                            onPress={() => this.props.navigation.navigate('AddWine')}
                        />
                    </View>
                )}
                <View style={{ marginBottom: 10 }} />
                {wineCards}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
});

export default WineList;
