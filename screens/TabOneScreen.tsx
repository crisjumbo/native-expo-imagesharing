import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
// import logo from '../assets/images/native-logo.png';

export default function TabOneScreen() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  let openImagePickerAsync = async ()  => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(permissionResult.granted === false){
      alert("Permission to access camera roll is required")
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if(pickerResult.cancelled === true){
      return;
    }

    if(Platform.OS === 'web'){
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({localUri: pickerResult.uri, remoteUri})
    }else{
      setSelectedImage({localUri: pickerResult.uri, remoteUri:null})
    }

  }

  let openShareDialogAsync = async () => {
    if(!(await Sharing.isAvailableAsync())){
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`)
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri);
  }

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button} >
          <Text style={styles.buttonText} >
            Share this photo
          </Text>
        </TouchableOpacity>
      </View>
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello world | Tab One</Text>
      <Image source={{uri:"https://i.imgur.com/TkIrScD.png"}} style={styles.logo} />
      <TouchableOpacity onPress={()=>openImagePickerAsync()} style={styles.button} >
        <Text style={styles.buttonText} >Pick a photo</Text>
      </TouchableOpacity>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  logo:{
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  button:{
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText:{
    fontSize: 20,
    color: '#fff'
  },
    thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
