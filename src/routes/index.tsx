/* ActivityIndicator - spiner que fica rodando */

import React, { useContext }  from "react";

import { View, ActivityIndicator } from "react-native";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

import { AuthContext } from "../contexts/AuthContext";

function Routes() {

    //const isAuthenticated = false;
/* Caso isso seja verdadeiro, vai retornar a rota /dashboard e caso seja falso, vai continuar na rota de login */    

    const { isAuthenticated, loading } = useContext(AuthContext);
  
    //const loading = false;

    if(loading) {
        return (
/* flex = 1 - pega toda a tela */            
            <View 
                style={{
                    flex: 1,
                    backgroundColor: "#1D1D2E",
                    justifyContent: "center",
                    alignItems: "center" 
                    }}
                >
{/* Este ActivityIndicator será mostrado quando a tela estiver carregando - loading */}                   
            <ActivityIndicator size={60} color="#FFF" />        
            </View>
        )
    }

    return (
/* Se estiver logado (true) ? renderiza o <AppRoutes/> Se não (false)renderiza o <AuthRoutes/>*/        
        isAuthenticated ? <AppRoutes/> : <AuthRoutes/>        
    )
}

export default Routes;