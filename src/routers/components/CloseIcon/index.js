import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default BasketIcon = ({navigation}) => {
    return (
        <View>
            <TouchableOpacity onPress={() => {
                navigation.goBack(null);
            } }>
                <Ionicons name="ios-close" size={48} color={"#fff"} style={{padding: 10, marginLeft: 10,marginTop:5,paddingVertical:5}}/>
            </TouchableOpacity>
        </View>
    );
};