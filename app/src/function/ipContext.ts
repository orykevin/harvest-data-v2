import React from 'react'

export interface ipContextInterface {
    ipConfig: string;
    setIpConfig: React.Dispatch<React.SetStateAction<string>>
}

const ipContext = React.createContext<ipContextInterface>({
    ipConfig: "127.0.0.1",
    setIpConfig : ()=>{}
})

export default ipContext