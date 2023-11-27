import React from 'react';
import {Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {BarCodeScanner} from "expo-barcode-scanner";
import {Icon} from "react-native-elements";
import {launchImageLibraryAsync} from "expo-image-picker";
import {manipulateAsync} from 'expo-image-manipulator';

class AddWine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'Red',
            name: '',
            year: '',
            origin: '',
            price: '',
            barcode: '',
            scanned: false,
            selectedImage: null,
            base64ImageData: null,
        };
    }

    openImagePicker = async () => {
        console.log('Opening image picker...')
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        try {
            const response = await launchImageLibraryAsync(options);
            if (response.canceled) {
                console.log('User cancelled image picker');
            } else {
                if (response.assets[0].hasOwnProperty('uri')) {
                    const manipulateResult = await manipulateAsync(
                        response.assets[0].uri,
                        [{ resize: { width: 500} }],
                        {
                            compress: 0.2,
                            base64: true,
                            format: 'png',
                        }
                    );

                    // Get the Base64 encoded image data
                    this.setState({ base64ImageData: manipulateResult.base64 });
                    this.setState({ selectedImage: manipulateResult.uri });
                    console.log('Image selected: ', manipulateResult.uri);
                }
            }
        } catch (error) {
            console.log('Error selecting image: ', error);
            alert('Error selecting image: ', error);
        }
    };

    sendWineAdditionRequest = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/addWine', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: this.state.type,
                    name: this.state.name,
                    year: this.state.year,
                    origin: this.state.origin,
                    price: this.state.price,
                    barcode: this.state.barcode,
                    image: this.state.base64ImageData,
                }),
            });
            if (response.ok) {
                alert('Wine successfully added!');
                await this.props.navigation.navigate('WineList', {isAdmin: true});
            } else {
                const responseData = await response.json();
                const reason = responseData && responseData.reason ? responseData.reason : 'Unknown reason';
                alert(`Wine addition failed (Error code: ${response.status})\nReason: ${reason}\nPlease try again.`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data:', error);
        }
    };

    validateWineAddition() {
        if (this.state.name === '' || this.state.year === '' || this.state.origin === ''
            || this.state.price === '' || this.state.barcode === '') {
            alert('Please fill all the fields');
            return false;
        }
        if (isNaN(this.state.year) || isNaN(this.state.price) || isNaN(this.state.barcode)) {
            alert('Year, price and barcode must be numbers');
            return false;
        }
        if (this.state.year.length !== 4) {
            alert('Year must be 4 digits long');
            return false;
        }
        if (this.state.base64ImageData === null) {
            alert('Please select an image');
            return false;
        }
        return true;
    };

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({ scanned: true });
        this.setState({ barcode: data });
    };

    render() {
        return (
            <View style={styles.container}>
                {!this.state.scanned ? (
                    <BarCodeScanner
                        onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                ) : (
                    <>
                        <Picker
                            style={{ height: 50, width: 150, borderColor: 'grey', borderWidth: 1 }}
                            itemStyle={{ color: "black"}}
                            selectedValue={this.state.type}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ type: itemValue })
                            }>
                            <Picker.Item label="Red" value="Red" />
                            <Picker.Item label="White" value="White" />
                            <Picker.Item label="Rose" value="Rose" />
                        </Picker>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Year"
                            onChangeText={(year) => this.setState({ year })}
                            value={this.state.year}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Origin"
                            onChangeText={(origin) => this.setState({ origin })}
                            value={this.state.origin}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Price (€)"
                            onChangeText={(price) => this.setState({ price })}
                            value={this.state.price}
                        />
                        <Button title="Choose from Device" onPress={this.openImagePicker} />
                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.validateWineAddition() ? this.sendWineAdditionRequest() : null
                        }}>
                            <View style={styles.buttonContainer}>
                                <Icon name={"add"} color="white" size={20} style={styles.icon}/>
                                <Text style={styles.buttonText}>Add a wine</Text>
                            </View>
                        </TouchableOpacity>
                        <Image source={{ uri: this.state.selectedImage }} style={{ width: 200, height: 200 }} />
                    </>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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

export default AddWine;