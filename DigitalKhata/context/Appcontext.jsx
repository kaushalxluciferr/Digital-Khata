import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    const [token, settoken] = useState(false)

    useEffect(() => {
        const fetchToken = async () => {
           const tok=await AsyncStorage.getItem('token')
           if(tok){
            settoken(tok)
           }
        }
        fetchToken()
    }, [])




    const value = {
    token,settoken
    }



    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider