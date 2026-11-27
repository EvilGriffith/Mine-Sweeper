import { BrowserRouter, HashRouter } from "react-router-dom"
import { AppRoute } from "./components/approute"

export const App = () => {
    return(
        <BrowserRouter>
            <AppRoute/>
        </BrowserRouter>
    )
}