import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {Card, Icon} from 'react-native-elements';
import {Picker} from "@react-native-picker/picker";

class WineList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wines: [],
            offset: 0,
            winesPerPage: 5,
            search: '',
            noMoreWines: 0,
            type: 'all',
        };
    }

    componentDidMount() {
        this.fetchWines();
    }

    fetchWines = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/getAllWines?offset=' +
                this.state.offset + '&winesPerPage=' + this.state.winesPerPage + '&search=' + this.state.search +
                '&filter=' + this.state.type, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                const bodyData = JSON.parse(responseData[0].body);
                if (!bodyData.wines.length && this.state.offset !== 0) {
                    return false;
                }
                if (!bodyData.wines.length) {
                    this.setState({wines: []});
                    this.setState({noMoreWines: this.state.search.length});
                } else {
                    this.setState({wines: bodyData.wines});
                }
                return true;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    previousPage = () => {
        if (this.state.offset !== 0) {
            this.setState({offset: this.state.offset - this.state.winesPerPage}, () => {
                this.fetchWines();
            });
        }
    }

    nextPage = () => {
        if (this.state.wines.length >= this.state.winesPerPage) {
            this.setState({offset: this.state.offset + this.state.winesPerPage}, () => {
                this.fetchWines().then(r => {
                    if (!r) {
                        this.setState({offset: this.state.offset - this.state.winesPerPage});
                    }
                });
            });
        }
    }

    render() {
        const wineCards = this.state.wines.length > 0 ? (
            this.state.wines.map((wine, index) => (
                <View key={index} style={{width: '90%'}}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('WineScreen', {
                            wine: wine,
                            isAdmin: this.props.route.params.isAdmin,
                            isConnected: this.props.route.params.isConnected,
                            username: this.props.route.params.username,
                            userId: this.props.route.params.userId,
                        })}>
                        <Card>
                            <Card.Title>{wine.name + ' (' + wine.year + ')'}</Card.Title>
                            <Card.Divider/>
                            <Text>{wine.type}</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
            ))
        ) : <Text>There is no wine matching your research 😞</Text>;
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
                    <TextInput
                        style={styles.input}
                        placeholder="Search wines"
                        onChangeText={(search) => {
                            this.setState({ search }, () => {
                                if (this.state.noMoreWines !== 0 && this.state.search.length >= this.state.noMoreWines) {
                                    this.state.wines = [];
                                    return;
                                } else if (this.state.noMoreWines !== 0) {
                                    this.setState({ noMoreWines: 0 });
                                }
                                this.setState({ offset: 0 });
                                this.fetchWines();
                            });
                        }}
                        value={this.state.search}
                    />
                    <Picker
                        style={{ height: 50, width: 150, borderColor: 'grey', borderWidth: 1 }}
                        itemStyle={{ color: "black"}}
                        selectedValue={this.state.type}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ type: itemValue }, () => {
                                this.fetchWines();
                            });
                        }}>
                        <Picker.Item label="All" value="all" />
                        <Picker.Item label="Red" value="Red" />
                        <Picker.Item label="White" value="White" />
                        <Picker.Item label="Rose" value="Rose" />
                    </Picker>
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
    input: {
        height: 40,
        width: '80%',
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
    },
    searchButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default WineList;