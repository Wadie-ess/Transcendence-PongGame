import { create } from 'zustand'
export type State = {
    isLogged: boolean,
    id:string,
    bio:string,
    phone:string,
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

type Action = {
    auth : {
        login: () => void,
        logout: () => void 
    },
    toggleTfa : (tfa : State['tfa']) => void ,
    updateFirstName : (firstName:State['name']['first']) => void,
    updateLastName : (lastName : State['name']['last']) => void ,
    updateEmail : (email : State['email']) => void,
    updatePhone : (phone: State['phone']) => void,
    updateBio : (bio : State['bio']) => void,
    // updatePicture : (picture : State['picture']) => void,
    // friend :{
    //     addFriend : (id: State['id']) => void,
    //     removeFriend : (id: State['id']) => void,
    //     ban : (id: State['id']) => void,
    // }
    // sendMessage : (id : State['dmsIds']) => void
    // updateHistory:  (history : State['history']) => void,
    // roomRole : (chatromm : State['chatRoomsJoinedIds']) => void
}

export const useUserStore = create<State & Action>((set) => ({
    isLogged:false,
    id:'',
    bio:'',
    phone:'',
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
    chatRoomsJoinedIds:[],
    toggleTfa : (tfa) => set(() => ({tfa: !tfa})),
    updateFirstName : (firstName) =>
     set((state) => ({
        name :{
            ...state.name,
            first: firstName
        }
    }) ),
    updateLastName : (lastName:string) =>
    set((state) => ({
       name :{
           ...state.name,
           last: lastName
       }
   }) ),
   updateEmail : (email :string) => set(() => ({
    email : email
   })),
   updatePhone : (phone:State['phone']) => set(() => ({phone:phone})),
   updateBio : (bio :State['bio']) => set(() => ({bio:bio})),
    auth:{
        login: async() => {
            const res = await fetch("https://randomuser.me/api");
            const data = await res.json();
            const user_data = data.results[0];
            console.log(user_data)
        
            const userInitialValue : State= {
                isLogged:true,
                id:user_data.id.value,
                bio:'Default bio',
                phone:user_data.cell,
                name:{
                    first:user_data.name.first,
                    last:user_data.name.last
                },
                picture:{
                    thumbnail:user_data.picture.thumbnail,
                    medium:user_data.picture.medium,
                    large:user_data.picture.large
                },
                
                email:user_data.email,
                tfa:false,
                friendListIds:[],
                banListIds:[],
                achivments:[],
                dmsIds:[],
                history:[],
                chatRoomsJoinedIds:[]
                
            }
            set({...userInitialValue})
        },
        logout : () => set({},true),
    },
}));