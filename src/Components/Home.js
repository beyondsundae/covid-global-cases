import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ChartRace from 'react-chart-race';

const Home = () => {
    var uniqBy = require('lodash.uniqby');

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
            await axios.get("http://localhost:4000/data")
            .then((res) => {

                const result = res.data
                const uniq = uniqBy(result, 'country') // remove ประเทศซ้ำ
                const final = uniq.map(( item ) => {
                    return{
                        country: item.country,
                        timeline: item.timeline.cases
                    }
                }) // refactor Array ใหม่

                let tempDate = {}
                uniq.find(( item ) => {
                    if (item.country === "USA") {
                        tempDate = item.timeline.cases
                    } 
                })
                const finalDate = Object.keys(tempDate) // สร้าง Array ของ 30 วัน


                let tempAmount = []
                let tempColor = []
                final.filter(( item ) => {
                   let color = "#" + Math.floor(Math.random()*16777215).toString(16)
                    
                   tempAmount = [
                       ...tempAmount,   
                    {
                        id: item.country,
                        title: item.country,
                        value: `${item.timeline[finalDate[0]]}`,
                        color: color
                    }
                   ]

                   tempColor = [
                       ...tempColor,
                       color
                   ]
                    // console.log(tempAmount)
                })

                setData(tempAmount)
                setColor(tempColor)

                setCases(final)
                setArrDate(finalDate)

                setInterval(() => {
                    setCount(( prev )=> prev + 1 )
                    
                }, 200);

                // console.log(finalDate.length)
                // console.log(tempColor)

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
                    value: `${item.timeline[ arrDate[count] !== undefined ? arrDate[count] : arrDate[arrDate.length - 1] ]}` , 
                    color: color[index]
                }
                ]
                // console.log(tempAmount)
            })


        setData(tempAmount)

        // console.log(data)
       
    }, [cases, arrDate, count])

    useEffect(() => {
        // console.log( count )
    }, [ count ])

    useEffect(()=>{
        getCases()
    }, [])

    return (
        <div>
             <div className=" container-fluid text-center pt-2" style={Style.Header}>
                    <h1>Covid Global Cases by SGN</h1>
                    {`Date :${arrDate[count] !== undefined ? arrDate[count] : arrDate[arrDate.length - 1]} `}
            </div>
            <div className=" container-fluid" style={Style.Content}>
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
                        fontSize: "10px"
                      }}
                     />
            </div>
  
        </div>
    )
}

export default Home


// const randomColor = () => {
//   return `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255})`;
// };