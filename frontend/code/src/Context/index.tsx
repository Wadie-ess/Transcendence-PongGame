import {useState , createContext, PropsWithChildren, FC} from 'react'

export type UserType = {
    isLogged: boolean,
    id:string,
    name:{
        first:string,
        last:string
    },
    picture:{
        thumbnail:string,
        medium:string,
        large:string
    },
    email:string,
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
export const userContext :any = createContext(null);
const userInitialValue : UserType= {
    isLogged:false,
    id:'',
    name:{
        first:'',
        last:''
    },
    picture:{
        thumbnail:'',
        medium:'',
        large:''
    },
    email:'',
    token:'',
    tfa:false,
    friendListIds:[],
    banListIds:[],
    achivments:[],
    dmsIds:[],
    history:[],
    chatRoomsJoinedIds:[]
    
}
export const UserContextProvider : FC<PropsWithChildren> = (content) => {
    const [user , setUser] = useState(userInitialValue);
    const login = (data : UserType) => {
        setUser(prevdata => ({...prevdata , ...data}))
    }
    const logout = () => {
        setUser(userInitialValue)
    }
    const toggleTfa = (olduser : UserType) => {
       const updatedUser = {...olduser};
       updatedUser.tfa = !updatedUser.tfa;
       setUser(updatedUser);
    }
    
    return (
        <userContext.Provider value={{user, login , logout , toggleTfa}}>
            {content.children}
        </userContext.Provider>
    )
}
