import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Home = () => {
    var uniqBy = require('lodash.uniqby');

    const [ cases, setCases ] = []

    const Style = {
        Header:{
            height: "10vh"
        },
        Content:{ 
            height: "89vh"
        }
    }

    const getCases = async () => {
        try{
            await axios.get("http://localhost:4000/data")
            .then((res) => {
                const result = res.data
                const uniq = uniqBy(result, 'country')
                const final = uniq.map(( item )=>{
                    return{
                        country: item.country,
                        timeline: item.timeline.cases
                    }
                })

                setCases(final)
                console.log(final)
            })
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getCases()
    }, [])

    return (
        <div>
             <div className=" container-fluid text-center pt-2 border border-danger" style={Style.Header}>
                    <h1>Covid Global Caese by SGN</h1>
                    Date :
            </div>
            <div className=" container-fluid border border-danger" style={Style.Content}>
                    xx
            </div>
  
        </div>
    )
}

export default Home
