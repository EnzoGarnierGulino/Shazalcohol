import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Comment = ({ author, text, date, note }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.author}>{author}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.text}>Note : {note}/20</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    author: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: '#888',
    },
    text: {
        fontSize: 14,
    },
});

export default Comment;
