const mongoose=require('mongoose');
export const db_connection=()=>{

  mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('DATABASAE IS CONNECTED SUCCESSFULLY')
  }).catch((e:any)=>{
    console.error(e?e.message:"database is not connected")
  })
}