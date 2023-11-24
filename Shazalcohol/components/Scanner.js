import React, {useState, useEffect, useCallback} from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {useFocusEffect} from "@react-navigation/native";

function Scanner(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isAdmin, setIsAdmin] = useState(props.route.params.isAdmin);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);


    const handleBarCodeScanned = async ({type, data}) => {
        setScanned(true);
        try {
            const response = await fetch('http://82.66.48.233:42690/getWineByBarcode?barcode=' + data, {
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
                        year: responseData.year
                    }

                    await props.navigation.navigate('WineScreen', {wine: wine, isAdmin: isAdmin});

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
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
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
});
