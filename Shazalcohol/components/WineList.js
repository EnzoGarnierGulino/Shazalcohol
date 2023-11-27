import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, ScrollView} from 'react-native';
import {Card, Icon} from 'react-native-elements';

class WineList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wines: [],
            offset: 0,
            winesPerPage: 10,
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
                this.setState({wines: bodyData.wines});
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    previousPage = () => {
        if (this.state.offset === 0) {
            return;
        } else {
            this.setState({offset: this.state.offset - this.state.winesPerPage}, () => {
                this.fetchWines();
            });
        }
    }

    nextPage = () => {
        if (this.state.wines.length < this.state.winesPerPage) {
            return;
        } else {
            this.setState({offset: this.state.offset + this.state.winesPerPage}, () => {
                this.fetchWines();
            });
        }
    }

    render() {
        const wineCards = this.state.wines && Array.isArray(this.state.wines) ? (
            this.state.wines.map((wine, index) => (
                <View key={index} style={{width: '90%'}}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('WineScreen', {
                            wine: wine,
                            isAdmin: this.props.route.params.isAdmin,
                            isConnected: this.props.route.params.isConnected,
                        })}>

                        <Card>
                            <Card.Title>{wine.name + ' (' + wine.year + ')'}</Card.Title>
                            <Card.Divider/>
                            <Text>{wine.type}</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
            ))
        ) : null;

        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.container}>
                    {this.props.route.params.isAdmin && (
                        <View>
                            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('AddWine')}>
                                <View style={styles.buttonContainer}>
                                    <Icon name={"add"} color="white" size={20} style={styles.icon}/>
                                    <Text style={styles.buttonText}>Add a wine</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={{marginBottom: 10}}/>
                    {wineCards}
                </ScrollView>
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.previousPage();
                    }}>
                        <View style={styles.buttonContainer}>
                            <Icon name={"navigate-before"} color="white" size={20} style={styles.icon}/>
                            <Text style={styles.buttonText}>Previous</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.nextPage();
                    }}>
                        <View style={styles.buttonContainer}>
                            <Icon name={"navigate-next"} color="white" size={20} style={styles.icon}/>
                            <Text style={styles.buttonText}>Next</Text>
                        </View>
                    </TouchableOpacity>
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
    button: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default WineList;
