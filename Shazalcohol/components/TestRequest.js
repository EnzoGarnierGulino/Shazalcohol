import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

function TestRequest() {
    const [response, setResponse] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('http://82.66.48.233:42690/');
            const data = await response.text();
            setResponse(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data');
        }
    };

    useEffect(() => {
        // Fetch data when the component mounts
        fetchData();
    }, []);

    return (
        <View>
            <Text>Server Response:</Text>
            <Text>{response}</Text>
            <Button title="Refresh" onPress={fetchData} />
        </View>
    );
}

export default TestRequest;