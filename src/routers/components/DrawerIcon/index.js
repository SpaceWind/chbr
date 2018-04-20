import React from 'react';
import {TouchableOpacity, View, Keyboard} from 'react-native';
import {Icon} from 'native-base';

export default DrawerIcon = ({navigation}) => {
    return (
        <View>
            <TouchableOpacity onPress={() => {
                Keyboard.dismiss();
                navigation.navigate('DrawerOpen');
            } }>
                <Icon ios='ios-menu' android="md-menu" style={{padding: 10, marginLeft: 10, color:"#fff"}}/>
            </TouchableOpacity>
        </View>
    );
};