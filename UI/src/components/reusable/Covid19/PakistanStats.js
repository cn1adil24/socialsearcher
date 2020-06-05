import React from 'react'
import Chart from 'chart.js'

class PakistanStats extends React.Component {

    state = {pakistan: this.props.data}
    drawChart({label, data, id, color, caption})    {

        var ctx = document.getElementById(id)
        
    
        new Chart(ctx, {
            type:'line',
            data: {
            labels: label,
            datasets: [{
                label: caption,
                borderColor: color,
                data: data
            }]
        },
    
    
        })
    
    }
    componentDidMount() {
        
        let dat = this.state.pakistan
        var label = []
        var infected = []
        var recovered = []
        var critical = []
        var death = []
        

        Object.keys(dat).forEach(function(key) {

            var d = new Date(Date.parse(key))
            var formatedDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
            label.push(formatedDate)
            infected.push(dat[key].infected)
            recovered.push(dat[key].recovered)
            critical.push(dat[key].critical)
            death.push(dat[key].deceased)
           
        });

        this.drawChart({label: label, data: infected, id:'pakInfectedStatus', color:'#E0A800', caption:'Pakistan\'s Infected Stats' })
        this.drawChart({label: label, data: critical, id:'pakCriticalStatus', color:'#FF0000', caption:'Pakistan\'s Critical Stats' })
        this.drawChart({label: label, data: recovered, id:'pakRecoveredStatus', color:'green', caption:'Pakistan\'s Recovered Stats' })
        this.drawChart({label: label, data: death, id:'pakDeathStatus', color:'gray', caption:'Pakistan\'s Death Stats' })
        
    }

    render() {

        return (
            <>
                <h2>Pakistan Statistics</h2>
                <div className="row p-0 mt-5">
                    <div className="col-sm-6">
                    
                        <canvas id="pakInfectedStatus"></canvas>
                    </div>
                    <div className="col-sm-6">
                    
                        <canvas id="pakCriticalStatus"></canvas>
                    </div>
                    
                </div>
                <div className="row p-0 mt-5">
                    <div className="col-sm-6">
                    
                        <canvas id="pakRecoveredStatus"></canvas>
                    </div>
                    <div className="col-sm-6">
                    
                        <canvas id="pakDeathStatus"></canvas>
                    </div>
                    
                </div>
            </>
        )

    }
}


export default PakistanStats;