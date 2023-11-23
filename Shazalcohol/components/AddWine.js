import React from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
        };
    }

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
                }),
            });
            if (response.ok) {
                alert('Wine successfully added!');
                await this.props.navigation.navigate('WineList');
            } else {
                const responseData = await response.json();
                const reason = responseData && responseData.reason ? responseData.reason : 'Unknown reason';
                alert(`Wine addition failed (Error code: ${response.status})\nReason: ${reason}\nPlease try again.`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
        if (this.state.barcode.length < 11) {
            alert('Barcode is too short');
            return false;
        }
        return true;
    };

    render() {
        return (
            <View style={styles.container}>
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
                    secureTextEntry={true}
                    onChangeText={(name) => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Year"
                    secureTextEntry={true}
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
                <TextInput
                    style={styles.input}
                    placeholder="Barcode"
                    onChangeText={(barcode) => this.setState({ barcode })}
                    value={this.state.barcode}
                />
                <Button
                    style={styles.button}
                    title="Add a wine"
                    onPress={() => {
                        this.validateWineAddition() ? this.sendWineAdditionRequest() : null
                    }}
                />
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
});

export default AddWine;