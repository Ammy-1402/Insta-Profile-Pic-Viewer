import React, { useState, useEffect } from 'react';
import LoadingComponent from '../../components/LoadingComponent';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    StatusBar,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Auth = () => {

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // console.log('Auth.js UseEffect');
        return () => {
            // console.log('Auth.js Cleanup')
        }
    })

    onGoogleButtonPress = async () => {
        setLoading(true)
        try {
            // Get the usersInfo
            const userInfo = await GoogleSignin.signIn();
            let userIdAndName = userInfo.user.id + "-" + userInfo.user.name
            let photoURL = userInfo.user.photo
            let token = userIdAndName + "*" + photoURL
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
            // Sign-in the user with the credential
            await auth().signInWithCredential(googleCredential);
            //Setting token to  AsyncStorage
            AsyncStorage.setItem("token", token)
                .then((res) => {
                    setLoading(false)
                    // console.log('Token Set Res: ', res)
                }).catch((err) => {
                    setLoading(false)
                    // console.log('Async Token set Error: ', err)
                })

        } catch (error) {

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                setLoading(false)
                // console.log('Error SIGN_IN_CANCELLED: ', error)
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                setLoading(false)
                // console.log('Error IN_PROGRESS: ', error)
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                setLoading(false)
                // console.log('Error PLAY_SERVICES_NOT_AVAILABLE: ', error)
            } else {
                // some other error happened
                setLoading(false)
                // console.log('Some other Error : ', error)
            }
        }
    }

    if (loading) {
        return <LoadingComponent />
    }

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <View style={styles.body}>
                {/* <Text style={{ fontSize: 20, marginBottom: 8 }}>A</Text> */}
                <View style={styles.imageContainer}>
                    <Image style={styles.imageStyle} source={require('../../assets/images/authImage.png')} />
                </View>
                <View style={styles.textHeadContainer}>
                    <Text style={styles.textHead}>Welcome to <Text
                        style={{
                            fontWeight: "bold"
                        }}
                    >Insta Profile </Text>
                    viewer</Text>
                </View>
                <TouchableOpacity
                    onPress={() => onGoogleButtonPress()}
                    style={styles.appButtonContainer}
                >
                    <View style={styles.googleContainer}>
                        <Image style={styles.googleImage} source={require('../../assets/images/google.png')} />
                        <Text style={styles.textBottom}> Login with Google</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: "90%",
        paddingBottom: 20,
        marginBottom: 10,
        alignItems: "center",
    },
    imageStyle: {
        width: 150,
        height: 260
    },
    textHeadContainer: {
        padding: 20,
        marginBottom: 20,

    },
    textHead: {
        textAlign: 'center',
        fontFamily: "ComicNeue-Regular",
        fontSize: 22
    },
    appButtonContainer: {
        elevation: 2,
        borderRadius: 14,
    },
    body: {
        flex:1,
        backgroundColor: "white",
        padding: 18,
        // height: "98%",
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    googleContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 20,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "black",
    },
    googleImage: {
        width: 30,
        height: 30,
        marginRight: 8,
    },
    textBottom: {
        fontSize: 22,
        color: "black",
    }
});

export default Auth;
