import React from 'react'
import Chart from 'chart.js'

class PakistanComparison extends React.Component {

    state = {world: this.props.world}
    drawBarChart = ({data, id, caption, Pakistan, bgColor}) => {

        var ctx= document.getElementById(id)
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [data[0]["Country,Other"], Pakistan["Country,Other"], data[1]["Country,Other"], data[2]["Country,Other"], data[3]["Country,Other"], data[4]["Country,Other"]],
                datasets: [{
                    label: caption,
                    barPercentage: 0.5,
                    barThickness: 30,
                    maxBarThickness: 18,
                    minBarLength: 10,
                    backgroundColor: bgColor,
                    data: [data[0][caption], Pakistan[caption], data[1][caption], data[2][caption], data[3][caption], data[4][caption]]
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            offsetGridLines: true
                        }
                    }]
                }
            }
        });

    }
    renderBarChart = (data) => {

        var Pakistan =""
        for(let i =0; i<data.length; i++){

            if( data[i]["Country,Other"] === "Pakistan")
                Pakistan = data[i]
        }

        
        this.drawBarChart({data: data, id: "infectedStatus", caption: "TotalCases", Pakistan: Pakistan, bgColor: "#E0A800"})
        this.drawBarChart({data: data, id: "criticalStatus", caption: "Serious,Critical", Pakistan: Pakistan, bgColor: "red"})
        this.drawBarChart({data: data, id: "recoveredStatus", caption: "TotalRecovered", Pakistan: Pakistan, bgColor: "green"})
        this.drawBarChart({data: data, id: "deathStatus", caption: "TotalDeaths", Pakistan: Pakistan, bgColor: "gray"})
        

    }
    componentDidMount() {

        var data = this.state.world
        var tableData = data[1]['data']
        this.renderBarChart(tableData)

    }

    render() {
        return(
            <>
                <h2>Pakistan Comparison With Other Countries</h2>
                <div className="row p-0 mt-5">
                    <div className="col-sm-6">
                    
                        <canvas id="infectedStatus"></canvas>
                    </div>
                    <div className="col-sm-6">
                    
                        <canvas id="criticalStatus"></canvas>
                    </div>
                    
                </div>
                <div className="row p-0 mt-5">
                    <div className="col-sm-6">
                    
                        <canvas id="recoveredStatus"></canvas>
                    </div>
                    <div className="col-sm-6">
                    
                        <canvas id="deathStatus"></canvas>
                    </div>
                    
                </div>
            </>
        )
    }
}
export default PakistanComparison;