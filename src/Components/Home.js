import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ChartRace from 'react-chart-race';

const Home = () => {
    var uniqBy = require("lodash.uniqby");
    var _ = require("lodash");

    const [status, setStatus] = useState(false);

    const [cases, setCases] = useState([]);
    const [data, setData] = useState([]);
    const [arrDate, setArrDate] = useState([]);

    const [color, setColor] = useState([]);

    const [count, setCount] = useState(0);

    const Style = {
        Header: {
        height: "11vh"
        },
        Content: {
        height: "88vh"
        }
    };

//////////////// Initial Function /////    
    const getCases = async () => {
        try {
        await axios
            .get("https://shielded-crag-84591.herokuapp.com/data")
            .then(({data}) => {
            setStatus(true);

//////////////// Date zone /////
            let tempDate = {};
                data.find((item) => {
                    if (item.country === "USA") {
                    tempDate = item.timeline.cases;
                }
            });

            const onlyDate = Object.keys(tempDate); // สร้าง Array ของวัน ดึง key ออกมาเป็น String
            const slicedDate = onlyDate.slice(5, 36); //ลำหรับเลือกวันลึกๆ

//////////////// Duplicate Country /////
            const AllCountryName = data.map((item, index) => {
                return item.country;
            }); // map เอามาเเต่ชื่อประเทศ เพื่อจะเอาไปหาประเทศทีซ้ำกัน

            const duplicateCountry = _.filter(AllCountryName, (item, index, array) => array.indexOf(item) !== index ); //หา ชื่อ ประเทศที่มีค่าซ้ำ
            const UniqeDuplicateCountry = _.uniq(duplicateCountry); // หา uniqe ประเทศที่ซ้ำ

            let DuplicateArr = []
            UniqeDuplicateCountry.forEach(( DupCountryName ) => {
                let duplicated = data
                    .filter((item) => {
                        return item.country === DupCountryName;
                    }) // filter แค่ ประเทศที่ชื่อซ้ำ
                    .map((item) => {
                        return {
                        country: item.country,
                        timeline: item.timeline.cases
                        };
                    }); // map กรองเอา properties ที่จะใช้
            
                let TempObj = {};
                slicedDate.forEach((item, index) => { // 30 วัน
                    TempObj[item] = _.sumBy(duplicated, `timeline[${onlyDate[index]}]`)})  // เป็นท่าที่เอาค่ารวมกันไว้ใน object เดียว 

                    DuplicateArr = [
                        ...DuplicateArr,
                        {
                        country: DupCountryName,
                        timeline: TempObj
                        }
                    ]
            });

//////////////// non-Duplicate Country /////
            const filteredUnique = uniqBy(data, "country"); // remove ประเทศที่ซ้ำออก

            const nonDuplicateArr = filteredUnique.map((item) => {
                return {
                country: item.country,
                timeline: item.timeline.cases
                };
            }); // จัดรุปเป็น Array ใหม่โดยดึงมาแค่ country กับ timeline

            const CombinedCountries = [ ...nonDuplicateArr, ...DuplicateArr]

//////////////// Final Transformation Data /////            
            let tempNewData = [];
            let tempColor = [];
            CombinedCountries.filter((item) => {
                let color = "#" + Math.floor(Math.random() * 16777215).toString(16);

                tempNewData = [
                ...tempNewData,
                {
                    id: item.country,
                    title: item.country,
                    value: `${item.timeline[slicedDate[count]]}`,
                    color: color
                }
                ];

                tempColor = [...tempColor, color];
            });

//////////////// /////
            setData(tempNewData); //ตัวที่จะเอาไปแสดงใน Chart
            setColor(tempColor); // เก็บสีไว้ทีเดียวเลย จะได้ไม่ต้องมีการ random สีใหม่ทุกครั้งทืี่ค่าเปลี่ยน

            setCases(CombinedCountries); // เก็บ cases เอาไว้ใช้ในการอัพเดทค่า
            setArrDate(slicedDate); //เก็บวันตามที่ get มา

            setInterval(() => {
                setCount((prev) => prev + 1);
            }, 250); // หลังจาก ได้ข้อมูลที่อย่างแล้วจะเริ่มการแสดงผล

            // console.log(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

 //////////////// Side-effect Function /////       
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
                                left: "85px",
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



            ////////// 

            // let china33provinces = data
            //     .filter((item) => {
            //         return item.country === "China"; // ทดสอบ โดบการเลือกประเทศจีนที่มี 33 จังหวัด 

            //     })
            //     .map((item) => {
            //         return {
            //         country: item.country,
            //         timeline: item.timeline.cases
            //         };

            //     }); // กรองเอา properties ที่จะใช้

            // let TempObj = {};

            // slicedDate.forEach((item, index) => {
            //     TempObj[item] = _.sumBy(china33provinces, `timeline[${onlyDate[index]}]`);

            // }); // เป็นท่าที่ Reduce ค่ารวมกันไว้ใน object ตัวเดียว 

            // const Country = {
            //     country: "China",
            //     timeline: TempObj

            // };

            //////////