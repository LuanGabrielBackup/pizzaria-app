import React, { useState, createContext, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../services/api";

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
    token: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    password: string;   
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<UserProps> ({
        id: '',
        name: '',
        email: '',
        token: ''
    })

const [loadingAuth, setLoadingAuth] = useState(false)  
const [loading, setLoading] = useState(true)  

/* As duas exclamações convertem user.name para booleano */ 
/* Se não foi feito o login, a variável name estará vazia, retornando o valor false para a variável, caso contrário, retornará true */   
    const isAuthenticated = !!user.name;

    useEffect(() => {
        async function getUser() {
/* Pegar os dados salvos do user */  
/* @sujeitopizzaria - Chave criada anteriormente */          
        const userInfo = await AsyncStorage.getItem('@sujeitopizzaria');
/* Anteriormente o objeto foi transformado em string, agora deve ser transformado em objeto novamente - caso não exista é transformado em um objeto vazio */ 
        let hasUser: UserProps = JSON.parse(userInfo || '{}')               

/* Verificar se as informações foram recebidas */
/* Se sim, será informado para a API utilizar o token do usuário nas próximas requisições */        
        if (Object.keys(hasUser).length > 0) {

    api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`

    setUser({
        id: hasUser.id,
        name: hasUser.name,
        email: hasUser.email,
        token: hasUser.token
    })
            
    }        
        setLoading(false);
    }   

        getUser();
    }, [])

/* SignInProps = tipagem */    
    async function signIn({ email, password }: SignInProps) {
       /* console.log(email)
        console.log(password) */
    
        setLoadingAuth(true);

        try{
            const response = await api.post('/session', {
                email,
                password
            })

            //console.log(response.data);

            const { id, name, token } = response.data;

/* Insere-se o objeto recebido no response.data dentro do objeto data */            
            const data = {
                ...response.data
            };    

/* @sujeitopizzaria é o nome da chave */ 
/* O AsyncStorage só deixa salvar uma string e deve-se salvar um objeto com os dados do usuário, logo, deve-se converter essas informações */ 
/* stringify - transforma o objeto data em uma string */          
            await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(data) )

/* Para memorizar o token recebido nas próximas requisições - utiliza-se a crase em volta do Bearer */            

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

/* Passa as informações do usuário */            
            setUser({
                id,
                name,
                email,
                token
            })

/* Altera-se o setLoadingAuth para false */            
            setLoadingAuth(false);

        } catch(err) {
            console.log('Erro ao acessar!', err)
            setLoadingAuth(false);
        }
    }

/* Função para deslogar o usuário */    
    async function signOut() {
        await AsyncStorage.clear()
        .then( () => {
            setUser({
                id: '',
                name: '',
                email: '',
                token: ''
            })
        })
    }

    return (
/* Todas as páginas vão passar pelo contexto da aplicação */        
        <AuthContext.Provider
         value={{ 
            user, 
            isAuthenticated, 
            signIn, 
            loading, 
            loadingAuth, 
            signOut 
                }}
        >
            {children}
        </AuthContext.Provider>
    )
}