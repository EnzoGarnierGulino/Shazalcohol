import React from 'react';
import {Image, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from "react-native-elements";
import Comment from "./Comment";

class WineScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: this.props.route.params.isAdmin,
            name: this.props.route.params.wine.name,
            year: this.props.route.params.wine.year,
            type: this.props.route.params.wine.type,
            isConnected: this.props.route.params.isConnected,
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
        if (this.state.name === '' || this.state.year === '' || this.state.origin === '' || this.state.price === '') {
            alert('Please fill all the fields');
            return false;
        }
        if (isNaN(this.state.year) || isNaN(this.state.price)) {
            alert('Year and price must be numbers');
            return false;
        }
        if (this.state.year < 0 || this.state.price < 0) {
            alert('Year and price must be positive');
            return false;
        }
        if (this.state.name > 50 || this.state.origin > 50) {
            alert('Name and origin must be less than 50 characters long');
            return false;
        }
        if (this.state.year < 1800 || this.state.year > 2023) {
            alert('Year must be between 1800 and 2023');
            return false;
        }
        if (this.state.price > 1000000) {
            alert('Price must be less than 1 million');
            return false;
        }
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
                await this.props.navigation.navigate('WineList', {isAdmin: this.state.isAdmin});
            } else {
                const responseData = await response.json();
                const reason = responseData && responseData.reason ? responseData.reason : 'Unknown reason';
                alert(`Wine modification failed (Error code: ${response.status})\nReason: ${reason}\nPlease try again.`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    getCircleColor(note) {
        if (note < 5) {
            return 'red';
        }
        if (note < 10) {
            return 'orange';
        }
        if (note < 15) {
            return '#FFD700';
        }
        else {
            return '#1d9a1d';
        }
    }

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
                            <TouchableOpacity style={styles.button} onPress={() => this.sendModifiedWine()}>
                                <View style={styles.buttonContainer}>
                                    <Icon name={"edit"} color="white" size={20} style={styles.icon}/>
                                    <Text style={styles.buttonText}>Edit wine</Text>
                                </View>
                            </TouchableOpacity>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Text style={styles.textTitle}>{this.state.name + ' (' + this.state.year + ')'}</Text>
                            <Text style={styles.text}>{this.state.type + ' wine from ' + this.state.origin}</Text>
                            <Image style={styles.img} source={require('../images/Wine1.png')}></Image>
                            <Text style={styles.text}>{this.state.price}€</Text>
                            <View style={{marginBottom: 20}}/>
                            <Text style={styles.text}>Average user rating</Text>
                            <View style={{marginBottom: 5}}/>
                            <View style={styles.container}>
                                <View style={[styles.circle, { backgroundColor: this.getCircleColor(8) }]} />
                                <Text style={styles.review}>8</Text>
                            </View>
                        </React.Fragment>
                    )}
                </React.Fragment>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={{marginBottom: 400}}>
                        <Comment author={"Jules"} text={"Nul"} date={"25/11/2023, 10:28"}/>
                        <Comment author={"Enzo"} text={"Bof"} date={"26/11/2023, 14:54"}/>

                        <Comment author={"Jules"} text={"Nul"} date={"25/11/2023, 10:28"} />
                        <Comment author={"Enzo"} text={"Bof"} date={"26/11/2023, 14:54"}/>
                        <Comment author={"Jules"} text={"Nul"} date={"25/11/2023, 10:28"}/>
                        <Comment author={"Enzo"} text={"Bof"} date={"26/11/2023, 14:54"}/>
                        <Comment author={"Jules"} text={"Nul"} date={"25/11/2023, 10:28"}/>
                        <Comment author={"Enzo"} text={"Bof"} date={"26/11/2023, 14:54"}/>
                        <Comment author={"Jules"} text={"Nul"} date={"25/11/2023, 10:28"}/>
                        <Comment author={"feur"} text={"Bof"} date={"26/11/2023, 14:54"}/>
                        <Comment author={"dada"} text={"Bof"} date={"26/11/2023, 14:54"}/>
                        <Comment author={"oknda"} text={"Bof"} date={"26/11/2023, 14:54"}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '60%',
        borderColor: 'grey',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    button: {
        width: '50%',
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'center',
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
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    textTitle: {
        fontSize: 30,
        textAlign: 'center',
    },
    review: {
        fontSize: 40,
        textAlign: 'center',
        color: 'white',
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 8,
        position: 'absolute',
        alignSelf: 'center',
    },
    img: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    }
});

export default WineScreen;