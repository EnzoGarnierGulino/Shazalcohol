import 'react-native-gesture-handler';
import React from 'react';
import HomePage from "./components/HomePage";
import ConnexionPage from "./components/ConnexionPage";
import WineList from "./components/WineList";
import WineScreen from "./components/WineScreen";
import AddWine from "./components/AddWine";
import CreateAccountPage from "./components/CreateAccountPage";
import Scanner from "./components/Scanner";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// The IP address of the server
export const serverIP = "http://82.66.48.233:42690/";
export let isConnectedG = false;
export function setIsConnectedG(value) {
    isConnectedG = value;
}
export let isAdminG = false;
export function setIsAdminG(value) {
    isAdminG = value;
}
export let usernameG = '';
export function setUsernameG(value) {
    usernameG = value;
}
export let userIdG = -1;
export function setUserIdG(value) {
    userIdG = value;
}
export let hashpassG = '';
export function setHashpassG(value) {
    hashpassG = value;
}
// The stack allows us to navigate between pages
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
                        name="CreateAccountPage"
                        component={CreateAccountPage}
                    />
                    <Stack.Screen
                        name="Scanner"
                        component={Scanner}
                    />
                    <Stack.Screen
                        name="AddWine"
                        component={AddWine}
                    />
                    <Stack.Screen
                        name="WineList"
                        component={WineList}
                    />
                    <Stack.Screen
                        name="WineScreen"
                        component={WineScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;