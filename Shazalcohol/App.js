import 'react-native-gesture-handler';
import React from 'react';
import HomePage from "./components/HomePage";
import ConnexionPage from "./components/ConnexionPage";
import WineList from "./components/WineList";
import WineScreen from "./components/WineScreen";
import Scanner from "./components/Scanner";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TestRequest from "./components/TestRequest";
const Stack = createStackNavigator();

class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="HomePage"
                        component={HomePage}
                    />
                    <Stack.Screen
                        name="ConnexionPage"
                        component={ConnexionPage}
                    />
                    <Stack.Screen
                        name="Scanner"
                        component={Scanner}
                    />
                    <Stack.Screen
                        name="WineList"
                        component={WineList}
                    />
                    <Stack.Screen
                        name="WineScreen"
                        component={WineScreen}
                    />
                    <Stack.Screen
                        name="TestRequest"
                        component={TestRequest}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;