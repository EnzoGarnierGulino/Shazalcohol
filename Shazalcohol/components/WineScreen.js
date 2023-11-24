import React from 'react';
import { View, Text } from 'react-native';

class WineScreen extends React.Component {
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
                        <Text>{this.props.route.params.wine.name}</Text>
                        <Text>{this.props.route.params.wine.year}</Text>
                        <Text>{wine.origin}</Text>
                        <Text>{wine.price}€</Text>
                    </React.Fragment>
                )}
            </View>
        );
    }
}

export default WineScreen;