import { Layout } from '../Layout'
import { Avatar } from './assets/Avatar'
import { Edit } from './assets/Edit'
import { Master } from '../Profile/assets/Master'
import { Newbie } from '../Profile/assets/Newbie'
// import { useState } from 'react'

export const Setting = () => { 
    return (
        <Layout>
            
           <div className="flex h-[90vh] w-full">
                <h1 className='pt-6 pl-6 font-poppins font-medium text-xl text-neutral'>Profile Settings</h1>
                <div className="overflow-auto h-[82%] w-[90%] flex flex-col absolute bottom-0 right-0 bg-base-200 rounded-tl-2xl">
                    <h2 className='pt-4 pl-4 text-neutral'>change preview</h2>
                    <div className="flex justify-center h-full w-full pt-8">
                        <div className="flex flex-col sm:flex-row justify-between w-[90%] h-auto sm:max-h-[40vh] xl:max-h-[30vh] max-h-[40vh] bg-base-100 border-solid border-gray-400 border-2  rounded-3xl">
                            <div className='flex justify-between items-center gap-x-10 px-2 sm:px-0'>
                                <div className='relative sm:pl-10 pt-2 sm:pt-0'><Avatar/>
                                    <div className="absolute bottom-0 right-0">
                                        <Edit/>
                                    </div>
                                </div>
                                <div className='flex flex-col items-stretch justify-evenly gap-y-4'>
                                    <div className='text-neutral break-words break-all font-poppins font-medium text-sm sm:text-xl'> Wadie Essandooo </div>
                                    <div className='font-poppins font-medium text-sm sm:text-lg'> Flutter Devoloper</div>
                                </div>
                            </div>
                            <div className="flex pr-6 items-center justify-center gap-x-2">
                                <Master/>
                                <Newbie/>
                            </div>
                        </div>
                    </div>
                    
                <h2 className='pt-4 pl-4 text-neutral'>change preview</h2>
                    <div className="flex justify-center h-full w-full pt-8">
                        <div className="flex flex-col sm:flex-row justify-between w-[90%] h-[50vh] sm:max-h-[50vh] xl:max-h-[30vh] max-h-[40vh] bg-base-100 border-solid border-gray-400 border-2  rounded-3xl">
                            <div className="flex justify-start  items-start pt-4 pl-4">
                                <h6 className='text-sm'>name</h6>
                                
                            </div>
                        </div>
                    </div>
                            
                </div>
           </div>
        </Layout>
    )
}