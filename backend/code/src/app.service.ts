import { Injectable } from '@nestjs/common';

const getWorld = async ():Promise<string> => {
  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  await sleepNow(3000)

 return "Hello World! from await "
}
@Injectable()
export class AppService {
  getHello(): any {
    const data = getWorld().then((data) => data).catch((err) => console.log(err))
    return data;
    
  }
}
