import { Route, Routes } from "react-router-dom"
import Roomlist from "./roomlist"
import Room from "./room"


export const AppRoute = () => {
    return(
        <Routes>
            <Route path="/" element={<Roomlist/>}/>
            <Route path="/room" element={<Room/>}/>
        </Routes>
    )
}