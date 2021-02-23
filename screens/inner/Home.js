import React, { useState, useEffect } from 'react';
import LoadingComponent from '../../components/LoadingComponent';
import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import { TextInput } from 'react-native-paper';
import Axios from 'axios';
import DOMParser from 'react-native-html-parser';
import CONST from '../../apiData';
import ImageZoom from 'react-native-image-pan-zoom';
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    Button,
    StatusBar,
    Dimensions
} from 'react-native';
import ShowProfile from '../../components/ShowProfile';
// import ipp from 'instagram-profile-picture';
// const ipp = require("instagram-profile-picture");

const Home = () => {

    const [loading, setLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [name, setName] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [text, setText] = useState("")

    onLogoutButtonPress = async () => {
        setLoading(true)
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            auth().signOut().then(() => {
                AsyncStorage.removeItem("token")
                    .then(() => {
                        setLoading(false)
                        // console.log('Signout Success | Token removed')
                    }).catch((err) => {
                        // console.log('Token removing Error', err)
                    })
            }).catch((err) => {
                // console.log('Signout Error: ', error)
                setLoading(false)
            })
        } catch (error) {
            setLoading(false)
            // console.log('Catch block Signout Error: ', error)
        }
    }

    findProfile = async () => {
        if (text === "") {
            Alert.alert(
                'Ops !!',
                'Kindly enter Username and search !!',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            return null;
                        },
                    }
                ],
                { cancelable: false },
            );
        } else {
            setProfileLoading(true)
            setShowProfile(false)
            // console.log('here')
            try {

                Axios.get("http://www.instagram.com/" + text.toLowerCase().trim())
                    .then((response) => {
                        const html = response.data;
                        const parser = new DOMParser.DOMParser();
                        const parsed = parser.parseFromString(html, 'text/html');
                        let metas = parsed.getElementsByTagName('meta')
                        for (let i = 0; i < metas.length; i++) {
                            if (metas[i].getAttribute('property') === "og:image") {
                                // console.log('>>> URL----------------', metas[i].getAttribute('content'));
                                setProfilePic(metas[i].getAttribute('content'))
                                setShowProfile(true)
                            }
                        }
                        // setProfilePic(result.data.graphql.user.profile_pic_url_hd)
                        // setName(result.data.graphql.user.full_name)
                        setProfileLoading(false)
                        setShowProfile(true)
                    })
                    .catch((err) => {
                        if (err.message === "Request failed with status code 404") {
                            // setError404(true)
                            Alert.alert(
                                'Ops !!',
                                'User not found ! \nOR\nEnter correct username.',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => {
                                            return null;
                                        },
                                    }
                                ],
                                { cancelable: false },
                            );
                        } else if (err.message === "Request failed with status code 429") {
                            // setError429(true)
                            Alert.alert(
                                'Ops !!',
                                'Too many request..\nEnter correct username OR Try again later ',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => {
                                            return null;
                                        },
                                    }
                                ],
                                { cancelable: false },
                            );
                        } else {
                            // console.log('Error: ', err.message)
                            Alert.alert(
                                'Error !!',
                                'Kindly try again later..',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => {
                                            return null;
                                        },
                                    }
                                ],
                                { cancelable: false },
                            );
                        }
                        setProfileLoading(false)
                    })
            } catch (error) {
                Alert.alert(
                    'Error !!',
                    'Catch Kindly try again later..',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                return null;
                            },
                        }
                    ],
                    { cancelable: false },
                );
                // console.log('Catch Error: ', error)
                setProfileLoading(false)
            }
        }
    }

    ClearData = () => {
        setText("")
        setProfilePic("")
        setShowProfile(false)
    }

    onHandleInput = (value) => {
        setText(value)
    }

    if (loading) {
        return <LoadingComponent />
    }

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Insta Profile Viewer</Text>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Logout',
                                'Are you sure ?\nYou want to logout ?',
                                [
                                    {
                                        text: 'No',
                                        onPress: () => {
                                            return null;
                                        },
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: () => onLogoutButtonPress(),
                                    },
                                ],
                                { cancelable: false },
                            );
                        }}
                        style={styles.headerRight}
                    >
                        <View style={styles.imageContainer}>
                            <Image style={styles.logoutImage} source={require('../../assets/images/signout.png')} />
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={{ backgroundColor: "white" }}
                    // contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={styles.body}>
                        <View style={styles.inputContainer}>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    style={{
                                        width: "100%", backgroundColor: "white"
                                    }}
                                    selectionColor="black"
                                    underlineColor="silver"
                                    label="Username"
                                    value={text}
                                    onChangeText={(text) => onHandleInput(text)}
                                />
                            </View>
                            <View style={{
                                marginTop: 20,
                                marginBottom: 10,
                            }}>
                                {
                                    showProfile ?
                                        <View style={{ marginHorizontal: 30 }}>
                                            <Button
                                                disabled={profileLoading}
                                                title="Search"
                                                onPress={() => {
                                                    Keyboard.dismiss()
                                                    findProfile()
                                                }}
                                            />
                                            <View style={{ marginTop: 15}}>
                                                <Button
                                                    color="#ff596b"
                                                    title="Clear"
                                                    onPress={() => ClearData()}
                                                />
                                            </View>
                                        </View> :
                                        <View style={{ marginHorizontal: 30 }}>
                                            <Button
                                                disabled={profileLoading}
                                                title="Search"
                                                onPress={() => {
                                                    Keyboard.dismiss()
                                                    findProfile()
                                                }}
                                            />
                                        </View>

                                }
                            </View>
                        </View>

                        {
                            profileLoading ?
                                <View style={{ marginTop: "50%" }}>
                                    <LoadingComponent />
                                </View>
                                :
                                <View></View>
                        }
                        {
                            showProfile ?
                                <View>
                                    <View style={styles.nameText}>
                                        <Text style={{ fontSize: 16 }}>Pinch to Zoom</Text>
                                    </View>
                                    <ImageZoom
                                        // enableSwipeDown={true}
                                        style={styles.profileContainer}
                                        cropWidth={Dimensions.get('window').width / 1.25}
                                        cropHeight={Dimensions.get('window').height / 1.25}
                                        imageWidth={Dimensions.get('window').width}
                                        imageHeight={400}
                                    >
                                        <Image
                                            style={{ height: 400 }}
                                            source={{
                                                uri: profilePic,
                                            }}
                                        />
                                    </ImageZoom>
                                </View>
                                :
                                <View></View>
                        }
                        <View style={{ paddingBottom: 60 }}></View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        elevation: 5,
        height: 50,
        backgroundColor: "#3f7bff",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    headerText: {
        fontFamily: "Dosis-Regular",
        fontSize: 20,
        color: "white",
        marginLeft: 14
    },
    headerRight: {
        elevation: 8,
        marginRight: 10
    },
    imageContainer: {
        padding: 4,
        backgroundColor: "white",
        borderRadius: 50,
    },
    logoutImage: {
        width: 22,
        height: 22,
        borderRadius: 50
    },
    body: {
        margin: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontFamily: "Dosis-Regular",
        padding: 20,
        color: "black",
        fontSize: 40
    },
    textInputContainer: {
        width: "100%",
    },
    inputContainer: {
        elevation: 4,
        flex: 1,
        backgroundColor: "white",
        // borderColor: "silver",
        // borderWidth: 0.3,
        borderRadius: 20,
        padding: 20,
        width: "100%",
    },
    profileContainer: {
        elevation: 4,
        backgroundColor: "white",
        marginTop: 20,
        // height: 200,
        borderRadius: 20,
        width: "100%",
        // margin: 30
        // padding: 20,
        // borderColor: "red",
        // borderWidth: 2,
    },
    nameText: {
        marginTop: 15,
        alignItems: "center"
        // paddingHorizontal: 20,
        // paddingBottom: 15,
    }
});

export default Home;
