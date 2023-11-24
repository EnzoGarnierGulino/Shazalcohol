import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

class WineList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wines: [],
            offset: 0,
            winesPerPage: 5,
        };
    }

    componentDidMount() {
        this.fetchWines();
    }

    fetchWines = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/getAllWines?offset=' + this.state.offset + '&winesPerPage=' + this.state.winesPerPage, {
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

    previousPage = () => {
        if (this.state.offset === 0) {
            return;
        }
        else {
            this.setState({ offset: this.state.offset - this.state.winesPerPage }, () => {
                this.fetchWines();
            });
        }
    }

    nextPage = () => {
        if (this.state.wines.length < this.state.winesPerPage) {
            return;
        }
        else {
            this.setState({ offset: this.state.offset + this.state.winesPerPage }, () => {
                this.fetchWines();
            });
        }
    }

    render() {
        const wineCards = this.state.wines && Array.isArray(this.state.wines) ? (
            this.state.wines.map((wine, index) => (
                <View key={index} style={{ width: '90%' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('WineScreen', { wine })}>
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
            <View style={{ flex: 1 }}>
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
                <View style={styles.bottomBar}>
                    <Button
                        title="Previous"
                        onPress={() => {
                            this.previousPage();
                        }
                        }
                    />
                    <Button
                        title="Next"
                        onPress={() => {
                            this.nextPage();
                        }
                        }
                    />
                </View>
            </View>
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
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingVertical: 10,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
});

export default WineList;
