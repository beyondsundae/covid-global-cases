import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ChartRace from 'react-chart-race';

const Home = () => {
    var uniqBy = require('lodash.uniqby');

    const [ status, setStatus ] = useState(false)

    const [ cases, setCases ] = useState([])
    const [ data, setData ] = useState([])
    const [ arrDate, setArrDate ] = useState([])

    const [ color, setColor ] = useState([])

    const [ count, setCount ] = useState(0)

    const Style = {
        Header:{
            height: "11vh"
        },
        Content:{ 
            height: "88vh"
        }
    }

    const getCases = async () => {
        try{
            await axios.get("https://shielded-crag-84591.herokuapp.com/data")
            .then((res) => {
                setStatus(true)

                const result = res.data
                const filteredUnique = uniqBy(result, 'country') // remove ประเทศที่ซ้ำออก

                const CountriesandTimeline = filteredUnique.map(( item ) => {
                    return{
                        country: item.country,
                        timeline: item.timeline.cases 
                    }
                }) // จัดรุปเป็น Array ใหม่โดยดึงมาแค่ country กับ timeline

                let tempDate = {}
                filteredUnique.find(( item ) => {
                    if (item.country === "USA") {
                        tempDate = item.timeline.cases
                    } 
                })
                
                const onlyDate = Object.keys(tempDate) // สร้าง Array ของวัน

                const slicedDate = onlyDate.slice(5, 36) //ลำหรับเลือกวันลึกๆ  15 Aug - 14 Sep

                let tempAmount = []
                let tempColor = []
                CountriesandTimeline.filter(( item ) => {
                   let color = "#" + Math.floor(Math.random()*16777215).toString(16)
                    
                   tempAmount = [
                       ...tempAmount,   
                    {
                        id: item.country,
                        title: item.country,
                        value: `${item.timeline[slicedDate[count]]}`,
                        color: color
                    }
                   ]

                   tempColor = [
                       ...tempColor,
                       color
                   ]
                    // console.log(tempAmount)
                })

                setData(tempAmount) //ตัวที่จะเอาไปแสดงใน Chart
                setColor(tempColor) // เก็บสีไว้ทีเดียวเลย จะได้ไม่ต้องมีการ random สีใหม่ทุกครั้งทืี่ค่าเปลี่ยน

                setCases(CountriesandTimeline) // เก็บ cases เอาไว้ใช้ในการอัพเดทค่า 
                setArrDate(slicedDate) //เก็บวันตามที่ get มา

                setInterval(() => {
                    setCount(( prev )=> prev + 1 )
                }, 250) // หลังจาก ได้ข้อมูลที่อย่างแล้วจะเริ่มการแสดงผล

                // console.log(finalDate.length)
                // console.log(tempAmount)
            })
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        let tempAmount = []
            cases.filter(( item, index ) => {
                tempAmount = [
                    ...tempAmount,   
                {
                    id: item.country,
                    title: item.country,
                    value: `${item.timeline[ arrDate[count] !== undefined ? arrDate[count] : arrDate[arrDate.length - 1] ]}`, //ใช้ค่า index เข้าถึงเพื่อเอาค่าวันที่ออกมา
                    color: color[index]
                }
                ]
                // console.log(tempAmount)
            })

        setData(tempAmount)
    }, [cases, count])

    useEffect(()=>{
        getCases()
    }, [])

    useEffect(() => {
        console.log(status)
    }, [status])

    return (
        <div>
             <div className=" container-fluid text-center pt-2" style={Style.Header}>
                    <h1>Covid Global Cases by SGN</h1>
                    {`Date :${arrDate[count] !== undefined ? arrDate[count] : arrDate[arrDate.length - 1]} `}
            </div>

            <div className=" container-fluid" style={Style.Content}>
                { !status ? (
                    <img 
                    src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/loading%2Fc1d187_40667438ff67484bb057a4c2168756b5_mv2.gif?alt=media&token=33bba46e-adb7-4a27-8568-3fc8668f038f" 
                    style={{width: "50%", margin: "auto"}}
                    className="row"
                    />
                ) : (
                        <ChartRace 
                            data={data}
                            width={1400}
                            itemHeight={38}
                            backgroundColor="white"
                            titleStyle={{
                                position: "absolute",
                                left: "20px",
                                marginTop: "-5px",
                                fontSize: "10px",
                            }}
                            valueStyle={{
                                position: "absolute",
                                left: "70px",
                                marginTop: "-5px",
                                fontSize: "10px",
                            }}
                        />
                    
                )}
            </div>
        </div>
    )
}

export default Home
