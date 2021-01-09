const express = require("express")
const axios = require('axios')
const cors = require('cors')

const app = express() //เพื่อ สร้าง server

app.use(cors ({
    origin:'*', 
    method: ["get"],
    credentials: true
})) // cors เป็น middleware ใช้กำหนดสิทธิ ใน คนอื่นที่อยู่นอกโดนเมน สามารถเข้ามาเอา resource ได้

const Port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send("Hi")
})

app.get('/data', async (req, res) => {
    try{
        const result = await axios.get('https://disease.sh/v3/covid-19/historical?lastdays=150') //ใช้ตัว historical ของ JHUCSSE จะได้ data ทัี้งหมดมาตาม parameter lastdays ที่ใส่ไป
        res.send( result.data ) // get มาต้อง send คืนในรูป result.data
        
     }
     catch (error){
          console.log(error)
     }
})

app.listen(Port)