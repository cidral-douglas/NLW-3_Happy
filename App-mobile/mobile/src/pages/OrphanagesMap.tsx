import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/map-marker.png';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanageMap() {
    const navigation = useNavigation();

    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect(()=> {
      api.get('orphanages').then(response => {
          setOrphanages(response.data);
      });
    }, [])

    function handleNavigateToOrphanageDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id });
    };

    function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapaPositions');
    };

    return (
        <View style={styles.container}>

      <View style={styles.header} />

      <MapView
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        initialRegion={{
          latitude: -26.3046652,
          longitude: -48.8528506,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }} >

          { orphanages.map(orphanage => {
            return (
              <Marker
                key={orphanage.id}
                icon={mapMarker}
                calloutAnchor={{
                  x: 2.7,
                  y: 0.8,
                }}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }} >

                <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                  <View style={styles.calloutContainer} >
                  <Text style={styles.calloutText} >{orphanage.name}</Text>
                  </View>
                </Callout>

            </Marker>
            );
          })}

        </MapView>

        <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

          <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
            <Feather name="plus" size={20} color="#FFF" />
          </RectButton>
        </View>

    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  
      backgroundColor: 'black',
    },
  
    header: {
      marginBottom: 20,
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: (Dimensions.get('window').height) - 20,
    },
  
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderWidth: 0.5,
      borderColor: '#0089a5',
      borderRadius: 16,
      justifyContent: 'center',
    },
  
    calloutText: {
      color: '#0089a5',
      fontFamily: 'Nunito_700Bold',
      fontSize: 14,
    },
  
    footer: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: '#FFF',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
      elevation: 3,
      shadowColor: 'black',
      shadowRadius: 2,
      shadowOpacity: 0.5,
      shadowOffset: {width: 1, height: 2},
  
    },
  
    footerText: {
      color: '#8fa7b3',
      fontFamily: 'Nunito_700Bold'
    },
  
    createOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15c3d6',
      borderRadius: 20,
  
      justifyContent: 'center',
      alignItems: 'center',
    }
  });
  