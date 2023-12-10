import React from 'react';
import {Image, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from "react-native-elements";
import Comment from "./Comment";
import {serverIP, isConnectedG, isAdminG, userIdG, usernameG, hashpassG} from "../App.js";

class WineScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: isAdminG,
            isConnected: isConnectedG,
            name: this.props.route.params.wine.name,
            year: this.props.route.params.wine.year,
            type: this.props.route.params.wine.type,
            comment: '',
            note: '',
            editedComment: '',
            editedNote: '',
            userReview: '',
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
            const response = await fetch(serverIP + 'getWine?wineId=' + this.props.route.params.wine.id, {
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
                    const response = await fetch(serverIP + 'getImageBase64/' + this.props.route.params.wine.id, {
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
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchComments = async () => {
        try {
            const response = await fetch(serverIP + 'getComments?wineId=' + this.props.route.params.wine.id, {
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
                const userComment = this.state.comments.find(comment => comment.userId === userIdG);
                if (userComment) {
                    this.setState({userReview: userComment});
                    this.setState({editedComment: userComment.comment});
                    this.setState({editedNote: userComment.note.toString()});
                }
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
            const response = await fetch(serverIP + 'editWine', {
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
                    userId: userIdG.toString(),
                    username: usernameG,
                    hashpass: hashpassG
                }),
            });
            if (response.ok) {
                alert('Wine successfully modified!');
                await this.props.navigation.navigate('HomePage');
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
            const response = await fetch(serverIP + 'postComment', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    note: this.state.note.toString(),
                    comment: this.state.comment,
                    wineId: this.props.route.params.wine.id,
                    userid: userIdG.toString(),
                    username: usernameG,
                    hashpass: hashpassG
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
            const response = await fetch(serverIP + 'deleteWine', {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.props.route.params.wine.id,
                    username: usernameG,
                    hashpass: hashpassG,
                    userId: userIdG.toString()
                })
            });
            if (response.ok) {
                alert('Wine successfully deleted!');
                await this.props.navigation.navigate('WineList');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    editComment = async (commentId) => {
        if (this.state.editedNote === '') {
            alert('Please fill the review field');
            return false;
        }
        if (this.state.editedNote < 0 || this.state.editedNote > 20) {
            alert('Review must be between 0 and 20');
            return false;
        }
        try {
            const response = await fetch(serverIP + 'editComment', {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: commentId,
                    userId: userIdG,
                    comment: this.state.editedComment,
                    note: this.state.editedNote,
                    username: usernameG,
                    hashpass: hashpassG
                })
            });
            if (response.ok) {
                alert('Comment successfully edited!');
                this.componentDidMount();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    deleteComment = async (commentId) => {
        try {
            const response = await fetch(serverIP + 'deleteComment', {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        id: commentId,
                        username: usernameG,
                        hashpass: hashpassG,
                        userId: userIdG.toString()
                    }
                )
            });
            if (response.ok) {
                alert('Comment successfully deleted!');
                this.setState({userReview: ''})
                this.componentDidMount();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    deleteCommentAdmin = async (commentId) => {
        try {
            const response = await fetch(serverIP + 'deleteComment', {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        id: commentId,
                        username: usernameG,
                        userId: userIdG,
                        hashpass: hashpassG
                    }
                )
            });
            if (response.ok) {
                alert('Comment successfully deleted!');
                if (this.state.userReview.commentId === commentId) {
                    this.setState({userReview: ''})
                }
                this.componentDidMount();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // This function is used to get the color of the circle depending on the average note
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
                        // If the user is an admin, we display the wine information and the possibility to edit it
                        <>
                            <React.Fragment>
                                <TextInput
                                    style={styles.input2}
                                    value={this.state.name}
                                    onChangeText={(name) => this.setState({name: name})}
                                />
                                <TextInput
                                    style={styles.input2}
                                    value={this.state.year.toString()}
                                    onChangeText={(year) => this.setState({year: year})}
                                />
                                <TextInput
                                    style={styles.input2}
                                    value={this.state.origin}
                                    onChangeText={(origin) => this.setState({origin: origin})}
                                />
                                <TextInput
                                    style={styles.input2}
                                    value={this.state.price}
                                    onChangeText={(price) => this.setState({price: price})}
                                />
                                {this.state.selectedImage ? (
                                    <>
                                        <Image source={{uri: this.state.selectedImage}} style={styles.img}/>
                                        <View style={{marginBottom: 20}}/>
                                    </>
                                ) : null}
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
                        // If the user is not an admin, we just display the wine information
                        <React.Fragment>
                            {this.state.selectedImage ? (
                                <Image source={{uri: this.state.selectedImage}} style={styles.img}/>
                            ) : null}
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name={"wine-bar"} color="black" size={25} style={{marginRight: 5}}/>
                                <Text style={styles.textTitle}>{this.state.name}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name={"date-range"} color="black" size={20} style={{marginRight: 5}}/>
                                <Text style={styles.text2}>{this.state.year}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name={"list"} color="black" size={20} style={{marginRight: 5}}/>
                                <Text style={styles.text2}>{this.state.type}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name={"location-pin"} color="black" size={20} style={{marginRight: 5}}/>
                                <Text style={styles.text2}>{this.state.origin}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name={"euro"} color="black" size={20} style={{marginRight: 5}}/>
                                <Text style={styles.text2}>{this.state.price}</Text>
                            </View>
                            <View style={styles.horizontalLine}/>
                            <View style={{marginBottom: 20}}/>
                            {this.state.averageNote === 99 ? (
                                <Text style={styles.text}>No average note available</Text>
                            ) : (
                                <>
                                    <View style={styles.container}>
                                        <View
                                            style={[styles.circle, {backgroundColor: this.getCircleColor(this.state.averageNote)}]}/>
                                        <Text style={styles.review}>{this.state.averageNote} / 20</Text>
                                    </View>
                                </>
                            )}
                        </React.Fragment>
                    )}
                </React.Fragment>
                <View style={{marginBottom: 20}}/>
                <View style={styles.horizontalLine}/>
                <View style={{marginBottom: 20}}/>
                {this.state.isConnected ? (
                    // Review handling and displaying
                        <>
                            {this.state.userReview ? (
                                <>
                                    <Text style={styles.text}>Your review</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Did you like this wine? Tell us why!"
                                            onChangeText={(editedComment) => this.setState({editedComment})}
                                            value={this.state.editedComment}
                                        />
                                        <TextInput
                                            style={styles.ratingInput}
                                            placeholder="Review (0 to 20)"
                                            keyboardType="numeric"
                                            onChangeText={(editedNote) => this.setState({editedNote})}
                                            value={this.state.editedNote}
                                        />
                                    </View>
                                    <TouchableOpacity style={styles.button}
                                                      onPress={() => this.editComment(this.state.userReview.commentId)}>
                                        <View style={styles.buttonContainer}>
                                            <Icon name={"edit"} color="white" size={20} style={styles.icon}/>
                                            <Text style={styles.buttonText}>Edit your review</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}
                                                      onPress={() => this.deleteComment(this.state.userReview.commentId)}>
                                        <View style={styles.buttonContainer}>
                                            <Icon name={"delete"} color="white" size={20} style={styles.icon}/>
                                            <Text style={styles.buttonText}>Delete your review</Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            ) : (
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
                            )}
                        </>
                    ) : (
                        <>
                            <Text style={styles.text}>You must be connected to add a review</Text>
                            <View style={{marginBottom: 20}}/>
                        </>
                    )
                }{this.state.comments.map((comment, index) => (
                    <React.Fragment key={index}>
                        <Comment
                            author={comment.username}
                            text={comment.comment}
                            date={comment.date}
                            note={comment.note}
                            authorId={comment.userId}
                            commentId={comment.commentId}
                        />
                        {this.state.isAdmin && (
                            <TouchableOpacity onPress={() => this.deleteCommentAdmin(comment.commentId)}>
                                <Text style={styles.delete}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </React.Fragment>
                ))
            }
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
        marginRight: 'auto',
    },
    input2: {
        height: 40,
        width: '68%',
        borderColor: 'grey',
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
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
    text2: {
        fontSize: 25,
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
        width: 150,
        height: 55,
        borderRadius: 8,
        position: 'absolute',
        alignSelf: 'center',
    },
    img: {
        width: '100%',
        height: 500,
        alignSelf: 'center',
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    delete: {
        color: 'red',
        textAlign: 'center',
        fontSize: 20,
    }
});

export default WineScreen;