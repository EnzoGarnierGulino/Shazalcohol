import React from 'react';
import {Image, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from "react-native-elements";
import Comment from "./Comment";
import WineList from "./WineList";

class WineScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: this.props.route.params.isAdmin,
            isConnected: this.props.route.params.isConnected,
            name: this.props.route.params.wine.name,
            year: this.props.route.params.wine.year,
            type: this.props.route.params.wine.type,
            comment: '',
            note: '',
            comments: [],
            averageNote: '',
            selectedImage: null,
        };
    }

    componentDidMount() {
        this.fetchWines();
        this.fetchComments();
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
                    averageNote: bodyData.note,
                });
                try {
                    const response = await fetch('http://82.66.48.233:42690/getImageBase64/' + this.props.route.params.wine.id, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const responseData = await response.json();
                        const bodyData = JSON.parse(responseData[0].body);
                        const base64ImageData = bodyData.image;
                        this.setState({selectedImage: `data:image/png;base64,${base64ImageData}`});
                    }
                } catch (error) {
                    console.log('Error selecting image: ', error);
                    alert('Error getting image', error);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchComments = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/getComments?wineId=' + this.props.route.params.wine.id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                const bodyData = JSON.parse(responseData[0].body);
                this.setState({comments: bodyData.comments});
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

    sendComment = async () => {
        if (this.state.note === '') {
            alert('Please fill the review field');
            return false;
        }
        if (this.state.note < 0 || this.state.note > 20) {
            alert('Review must be between 0 and 20');
            return false;
        }
        try {
            const response = await fetch('http://82.66.48.233:42690/postComment', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    note: this.state.note.toString(),
                    comment: this.state.comment,
                    wineId: this.props.route.params.wine.id,
                    userid: this.props.route.params.userId.toString(),
                    username: this.props.route.params.username,
                }),
            });
            if (response.ok) {
                alert('Comment successfully added!');
                this.componentDidMount();
            } else {
                const responseData = await response.json();
                const reason = responseData && responseData.reason ? responseData.reason : 'Unknown reason';
                alert(`Comment addition failed (Error code: ${response.status})\nReason: ${reason}\nPlease try again.`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    deleteWine = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/deleteWine', {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.props.route.params.wine.id,
                })
            });
            if (response.ok) {
                alert('Wine successfully deleted!');
                await this.props.navigation.navigate('HomePage', {isAdmin: this.state.isAdmin});
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    getCircleColor(note) {
        if (note < 5) {
            return '#da4545';
        }
        if (note < 10) {
            return 'orange';
        }
        if (note < 15) {
            return '#FFD700';
        } else {
            return '#1d9a1d';
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <React.Fragment>
                    {this.state.isAdmin ? (
                        <>
                            <Image source={{uri: this.state.selectedImage}}/>
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
                                <TouchableOpacity style={styles.button} onPress={() => this.deleteWine()}>
                                    <View style={styles.buttonContainer}>
                                        <Icon name={"delete"} color="white" size={20} style={styles.icon}/>
                                        <Text style={styles.buttonText}>Delete wine</Text>
                                    </View>
                                </TouchableOpacity>
                            </React.Fragment>
                        </>
                    ) : (
                        <React.Fragment>
                            <Text style={styles.textTitle}>{this.state.name + ' (' + this.state.year + ')'}</Text>
                            <Text
                                style={styles.text}>{this.state.type + ' wine from ' + this.state.origin + ' (' + this.state.price + '€)'}</Text>
                            <Image source={{uri: this.state.selectedImage}} style={{width: 200, height: 600}}/>
                            <View style={{marginBottom: 20}}/>
                            {this.state.averageNote === 99 ? (
                                <Text style={styles.text}>No reviews yet</Text>
                            ) : (
                                <>
                                    <Text style={styles.text}>Average user rating</Text>
                                    <View style={{marginBottom: 5}}/>
                                    <View style={styles.container}>
                                        <View
                                            style={[styles.circle, {backgroundColor: this.getCircleColor(this.state.averageNote)}]}/>
                                        <Text style={styles.review}>{this.state.averageNote}</Text>
                                    </View>
                                </>
                            )}
                        </React.Fragment>
                    )}
                </React.Fragment>
                <View style={{marginBottom: 20}}/>
                {this.state.isConnected ? (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Did you like this wine? Tell us why!"
                                onChangeText={(comment) => this.setState({comment})}
                                value={this.state.comment}
                            />
                            <TextInput
                                style={styles.ratingInput}
                                placeholder="Review (0 to 20)"
                                keyboardType="numeric"
                                onChangeText={(note) => this.setState({note})}
                                value={this.state.note}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => this.sendComment()}>
                            <View style={styles.buttonContainer}>
                                <Icon name={"add"} color="white" size={20} style={styles.icon}/>
                                <Text style={styles.buttonText}>Add a review</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.text}>You must be connected to add a review</Text>
                    </>
                )}
                {this.state.comments.map((comment, index) => (
                    <Comment key={index} author={comment.username} text={comment.comment} date={comment.date}
                             note={comment.note}/>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        height: 40,
        width: '68%',
        borderColor: 'grey',
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
    },
    ratingInput: {
        height: 40,
        width: '27%',
        borderColor: 'grey',
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
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
        width: 90,
        height: 55,
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