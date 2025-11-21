import { createContext, useContext, useState } from "react";

interface AppContextType {
    theme: string;
    setTheme: (v: string) => void;
    appState: IUserLogin | null;
    setAppState: (v: any) => void
    cart: ICart | Record<string, never>
    setCart: (v: any) => void,
    restaurant: IRestaurant | null // Backward compatibility - maps to bookstore
    setRestaurant: (v: any) => void,
    bookstore: IBookstore | null // New primary field
    setBookstore: (v: any) => void,
}

const AppContext = createContext<AppContextType | null>(null)

interface IProps {
    children: React.ReactNode
}


const AppProvider = (props: IProps) => {
    const [theme, setTheme] = useState<string>("tuan anh");
    const [appState, setAppState] = useState<IUserLogin | null>(null);

    const [cart, setCart] = useState<ICart | Record<string, never>>({})
    const [bookstore, setBookstore] = useState<IBookstore | null>(null)
    // Backward compatibility - sync restaurant with bookstore
    const restaurant = bookstore as IRestaurant | null
    const setRestaurant = (v: any) => setBookstore(v)
    
    return (
        <AppContext.Provider value={{ theme, setTheme, appState, setAppState, cart, setCart, restaurant, setRestaurant, bookstore, setBookstore }}>
            {props.children}
        </AppContext.Provider>
    );
};

export const useCurrentApp = () => {
    const currentTheme = useContext(AppContext);

    if (!currentTheme) {
        throw new Error(
            "useCurrentUser has to be used within <AppContext.Provider>"
        );
    }

    return currentTheme;
};

export default AppProvider;