import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {serverIP} from "../App.js";

function Scanner(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);


    useEffect(() => {
        props.navigation.addListener('focus', () => {
            setScanned(false);
        });
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);


    const handleBarCodeScanned = async ({type, data}) => {
        setScanned(true);
        try {
            const response = await fetch(serverIP + 'getWineByBarcode?barcode=' + data, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.response === "true") {
                    const wine = {
                        id: responseData.id,
                        name: responseData.name,
                        year: responseData.year,
                        type: responseData.type,
                    }
                    await props.navigation.navigate('WineScreen', {wine: wine});
                }
                else {
                    alert('This wine is not in the database!');
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button style={StyleSheet.button} title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
}

export default Scanner;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    button: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36
    }
});
