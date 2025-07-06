import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Validate from "./Validate";


export default function Router() {

    
    
    

    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/validate" element={<Validate />} />
            </Routes>
        </BrowserRouter>
        </>
    );
}