
import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routes";

import { api } from "../../services/api";

import { AuthContext } from "../../contexts/AuthContext";

export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    const { signOut } = useContext(AuthContext);
    //useState começa com uma string vazia
    const [number, setNumber] = useState('');

    async function openOrder() {
        //alert(number)
        if (number === '') {
            return;
        }
/* Novo código para enviar a mesa */

const response = await api.post('/order', {
    table: Number(number)
})  

    //console.log(response.data);
navigation.navigate('Order', { number: number, order_id: response.data.id })

    setNumber('');


/* Fazer a requisição, abrir a mesa e navegar para a próxima tela */
       /* navigation.navigate('Order', { number: number, order_id: 'eb3e52f6-0bad-4d1f-a95e-401dfb489e9c' }) */
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}> NOVO PEDIDO </Text>

            <TextInput 
                placeholder="Número da mesa"
                placeholderTextColor="#F0F0F0"
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />
            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}> ABRIR MESA </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#1D1D2E',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFF'
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#3FFFA3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    buttonText: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    }
})