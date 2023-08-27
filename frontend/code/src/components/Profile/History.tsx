import { Chart } from './assets/Chart'
import { Table } from './assets/Table'
export const History = () => {
    return (
        <div className='flex flex-col rounded-2xl justify-start items-start mt-6 sm:h-full h-full w-full  bg-base-200 overflow-scroll no-scrollbar'>
           <div className="flex justify-start items-start pl-2 pt-2 sm:pl-12 sm:pt-12 gap-x-4 py-4">
               <Chart/> <span className='font-montserrat'>Matches History</span>

           </div>
            <Table />
        </div>
    )
}