import {useState , createContext, PropsWithChildren, FC} from 'react'

export type User = {
    isLogged: boolean,
    user : {
        id:string,
        username:string,
        avatar:string,
        token:string,
        tfa:boolean,
        friendListIds:string[],
        banListIds:string[],
        achivments:number[],
        dmsIds:string[],
        history:[{
            winnerId:string,
            loserId:string,
            score:number
        }] | [],
        chatRoomsJoinedIds:[
            {
                id:number,
                isAdmin:boolean,
                isOwner:boolean
            }
        ] | [],
    }
}
export const userContext :any = createContext(null);
const userInitialValue : User= {
    isLogged:false,
    user : {
        id:'',
        username:'',
        avatar:'',
        token:'',
        tfa:false,
        friendListIds:[],
        banListIds:[],
        achivments:[],
        dmsIds:[],
        history:[],
        chatRoomsJoinedIds:[]
    }
}
export const UserContextProvider : FC<PropsWithChildren> = (content) => {
    const [user , setUser] = useState(userInitialValue);
    const login = (data : User) => {
        setUser(prevdata => ({...prevdata , ...data}))
    }
    const logout = () => {
        setUser(userInitialValue)
    }
    const toggleTfa = (olduser : User) => {
       const updatedUser = {...olduser};
       updatedUser.user.tfa = !updatedUser.user.tfa;
       setUser(updatedUser);
    }
    return (
        <userContext.Provider value={{user, login , logout , toggleTfa}}>
            {content.children}
        </userContext.Provider>
    )
}