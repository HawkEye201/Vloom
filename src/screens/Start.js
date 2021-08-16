import React, { useState, useEffect } from 'react';
import {View, Text, Image, StyleSheet, Button, Platform, Dimensions, TouchableOpacity, ImageBackground} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import PinchZoomView from 'react-native-pinch-zoom-view';
import {SimpleLineIcons} from '@expo/vector-icons';
import {Video} from 'expo-av'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =Dimensions.get('window').height;

export default function Start(){
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [storagePermission, setStoragePaermission] = useState(null);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [micPermission, setMicPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const [cameraRef, setCameraRef] = useState(null);
    const [recording, setRecording] = useState(false);
    const [viewVideo, setViewVideo] = useState(false);

    useEffect(() => {
        (async () => {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setStoragePaermission(status === 'granted')
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setCameraPermission(status === 'granted');
        })();
    }, []);
    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestMicrophonePermissionsAsync();
          setMicPermission(status === 'granted');
        })();
      }, []);

    if(storagePermission === false || cameraPermission === false || micPermission === false){
        return <View style = {{flex:1, alignSelf: 'center', justifyContent: 'center'}}>
            <Text>Insufficient Permission! Restart app to try again.</Text>
        </View>
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1
        })
        if(!result.cancelled){
            setImage(result.uri);
        }
    }

    const startRecord = async () => {;
        setRecording(true);
        let result = await cameraRef.recordAsync();
        setVideo(result.uri)
    }
    const stopRecord = async () => {
        cameraRef.stopRecording();
        setRecording(false);
        setViewVideo(true);
    }

    return (
        <View style = {styles.all}>    
            <ImageBackground source = {require('../../assets/in.jpg')} style = {styles.container}>
            {viewVideo === true && 
                <View style = {{flex: 2, backgroundColor: 'white'}}>
                    <Video 
                        source = {{uri:video}}
                        style = {{flex:1}}
                        useNativeControls
                        resizeMode = 'contain'
                    />
                    <Button 
                    title = "Close Video"
                    onPress = {() => {setViewVideo(false)}}
                    />
                </View>
            }
            {image &&
                <PinchZoomView maxScale = {3}>
                    <Image source = {{uri: image}}  style = {styles.image}/>
                </PinchZoomView>
            }

               <PinchZoomView maxScale = {5}>
                    <View style = {styles.video}>
                        <Camera style = {styles.camera}
                            type = {type} ratio = {'4:3'}
                            ref = {(ref) => {setCameraRef(ref)}} >
                        </Camera> 
                    </View>
                </PinchZoomView>
            
            </ImageBackground>

            {recording === false && <View style = {styles.bottom}>
                <TouchableOpacity onPress = {pickImage} style = {{flex:1, alignItems: 'center'}}>
                    <View style = {{backgroundColor: 'grey', borderRadius: 50, width: 50, height: 50, }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress = {startRecord} style = {{flex:1, alignItems: 'center'}} >
                    <View style = {{borderColor: 'white', borderWidth: 2, borderRadius: 50, width: 60, height: 60, alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{backgroundColor: 'white', borderRadius: 50, width: 50, height: 50}} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                style = {{flex:1, alignItems: 'center'}}
                onPress = {() => {setType(type === Camera.Constants.Type.front 
                    ? Camera.Constants.Type.back : Camera.Constants.Type.front)}}>
                    <SimpleLineIcons name = {Platform.OS === 'ios' ? 'ios-camera-reverse' : 'refresh'} color = "white" size = {35} />
                </TouchableOpacity>
            </View>}
            {recording === true &&
            <View style = {styles.stop}>
                <TouchableOpacity onPress = {stopRecord} style = {{flex:1}} >
                    <View style = {{borderColor: 'white', borderWidth: 2, borderRadius: 50, width: 60, height: 60, alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{backgroundColor: 'red', borderRadius: 50, width: 50, height: 50}} />
                    </View>
                </TouchableOpacity>
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    all: {
        flex: 1,
      backgroundColor: 'black',
    //   backgroundColor: 'red',
      paddingTop: 10,
    },
    image: {
        flex: 1,
        width: deviceWidth,
        height: deviceHeight,
        resizeMode: 'contain',
        borderRadius: 10
    },
    container: {
        flex: 1,
        marginTop: 20,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden'
    },
    flip:{
        flex: 1,
        alignSelf: 'flex-end',
    },
    video: {
        flex: 0.5,
        position: 'absolute',
        bottom: 5,
        right: 5
    },
    camera: {
        // flex: 1,
        width: 125,
        height: 165,
        padding: 10,
    },
    bottom: {
        padding: 10,
        flex: 0.1,
        flexDirection: 'row',
        // backgroundColor:'green',
        // alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonPick: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    start: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stop: {
        padding: 10,
        flex: 0.1,
        alignSelf: 'center',
        justifyContent: 'center'
    }
  });