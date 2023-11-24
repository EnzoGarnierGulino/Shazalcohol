import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

class WineScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: this.props.route.params.isAdmin,
            wines: [],
            name: '',
            year: '',
            origin: '',
            price: '',
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
                this.setState({ wines: bodyData });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    render() {
        const wine = this.state.wines ? this.state.wines : null;
        return (
            <View>
                {wine && (
                    <React.Fragment>
                        {this.state.isAdmin ? (
                            <React.Fragment>
                                <TextInput
                                    style={styles.input}
                                >{this.props.route.params.wine.name}</TextInput>
                                <TextInput>{this.props.route.params.wine.year}</TextInput>
                                <TextInput>{wine.origin}</TextInput>
                                <TextInput>{wine.price}€</TextInput>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Text>{this.props.route.params.wine.name}</Text>
                                <Text>{this.props.route.params.wine.year}</Text>
                                <Text>{wine.origin}</Text>
                                <Text>{wine.price}€</Text>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
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