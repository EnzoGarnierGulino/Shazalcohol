import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';

class WineScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: this.props.route.params.isAdmin,
            name: this.props.route.params.wine.name,
            year: this.props.route.params.wine.year,
        };
    }

    componentDidMount() {
        this.fetchWines();
    }

    fetchWines = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/getWine?wineId=' + this.props.route.params.wine.id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                const bodyData = JSON.parse(responseData[0].body);
                this.setState({
                    origin: bodyData.origin,
                    price: bodyData.price.toString(),
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    sendModifiedWine = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/editWine', {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    year: this.state.year,
                    origin: this.state.origin,
                    price: this.state.price,
                    id: this.props.route.params.wine.id,
                }),
            });
            if (response.ok) {
                alert('Wine successfully modified!');
                await this.props.navigation.navigate('WineList');
            } else {
                const responseData = await response.json();
                const reason = responseData && responseData.reason ? responseData.reason : 'Unknown reason';
                alert(`Wine modification failed (Error code: ${response.status})\nReason: ${reason}\nPlease try again.`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    render() {
        return (
            <View>
                <React.Fragment>
                    {this.state.isAdmin ? (
                        <React.Fragment>
                            <TextInput
                                style={styles.input}
                                value={this.state.name}
                                onChangeText={(name) => this.setState({name: name})}
                            />
                            <TextInput
                                style={styles.input}
                                value={this.state.year.toString()}
                                onChangeText={(year) => this.setState({year: year})}
                            />
                            <TextInput
                                style={styles.input}
                                value={this.state.origin}
                                onChangeText={(origin) => this.setState({origin: origin})}
                            />
                            <TextInput
                                style={styles.input}
                                value={this.state.price}
                                onChangeText={(price) => this.setState({price: price})}
                            />
                            <Button
                                title="Edit wine"
                                onPress={() => this.sendModifiedWine()}/>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Text>{this.state.name}</Text>
                            <Text>{this.state.year}</Text>
                            <Text>{this.state.origin}</Text>
                            <Text>{this.state.price}€</Text>
                        </React.Fragment>
                    )}
                </React.Fragment>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '80%',
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
    },
});

export default WineScreen;