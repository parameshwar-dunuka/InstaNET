import { Outlet } from "react-router-dom"
import { AppContext } from "../AppContext"
export function AppLayout(){
    return (
    <>
    <div>
        <AppContext>
            <Outlet />
        </AppContext>
    </div>
    </>)
}