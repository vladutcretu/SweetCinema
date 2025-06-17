import { createContext, useState, useContext } from "react";

const CityContext = createContext()

export function CityProvider({ children }) {
    const [selectedCityId, setSelectedCityId] = useState(null)
    const [selectedCityName, setSelectedCityName] = useState("City Location")

    return (
        <CityContext
            value={{
                selectedCityId,
                setSelectedCityId,
                selectedCityName,
                setSelectedCityName
            }}
        >
            {children}
        </CityContext>
    )
}

export function useCityContext() {
    return useContext(CityContext)
}
