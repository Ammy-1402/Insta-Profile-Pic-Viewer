import React from 'react'
import { View, StyleSheet } from 'react-native'

function ShowProfile(props) {
    return (
        <View style={{...props.style , ...styles.container}} >
            <Text>Hello</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    }
})

export default ShowProfile;
