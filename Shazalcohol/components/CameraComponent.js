import React from 'react';
import { View } from 'react-native';
import "../styles/styles.css";
import Button from "./Button";

export default function CameraComponent() {
    return (
        <View>
            <Button text={"Prendre une photo"}/>
        </View>
    );
}