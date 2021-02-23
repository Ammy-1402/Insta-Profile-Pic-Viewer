import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

function LoadingComponent(props) {
    return (
        <View style={{...props.style , ...styles.container}} >
            <ActivityIndicator size="large" color="#5b8bf4" ></ActivityIndicator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.6,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default LoadingComponent;
