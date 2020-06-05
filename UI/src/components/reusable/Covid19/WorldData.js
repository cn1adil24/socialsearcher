import React from 'react'
// import World from '../../js/world.json'
import Tableau from './Tableau'
// import $ from 'jquery'


class WorldData extends React.Component {


    state = {world: this.props.world}
    // renderTable = (tableData) => {
        
    //     return tableData.map(elem => {
            
    //         return <tr>
                
    //                     <td>{elem["Country,Other"]}</td>
    //                     <td>{elem["TotalCases"]}</td>
    //                     <td>{elem["NewCases"]}</td>
    //                     <td>{elem["TotalDeaths"]}</td>
    //                     <td>{elem["NewDeaths"]}</td>
    //                     <td>{elem["TotalRecovered"]}</td>
    //                     <td>{elem["ActiveCases"]}</td>
    //                     <td>{elem["Serious,Critical"]}</td>
                        
    //                     <td>{elem["Tot Cases/1M pop"]}</td>
    //                     <td>{elem["Deaths/1M pop"]}</td>
    //                     <td>{elem["TotalTests"]}</td>
    //                     <td>{elem["Tests/\n1M pop\n"]}</td>
    //                     <td>{elem["Continent"]}</td>
                        
    //                 </tr>
            
    //     });
        
        
    // }
    // valueChange = (value) => {

    //     this.setState( {input: value})

    //     var val = this.state.input.toLowerCase();
    //     $("#myTable tr").filter(function() {
    //         $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1)
    //       });
    // }
    // renderWorldData = () =>{

        
    
    //     // this.renderBarChart(tableData)
    
    //     return (
    
    //         <>
                
                
    //             <h2 className="float-left mt-4">World wide cases</h2>
    //             <input class="float-right" id="myInput" type="text" placeholder="Search.."
    //                 onChange={(e) => this.valueChange(e.target.value)}
    //                 value={this.state.input}
    //             ></input>
    //             <div className="table-responsive table-wrapper-scroll-y my-custom-scrollbar mt-3">
    //                 <table className="table table-bordered table-striped">
    //                 <thead>
    //                     <tr>
    //                         <th>Country,Other</th>
    //                         <th>TotalCases</th>
    //                         <th>NewCases</th>
    //                         <th>TotalDeaths</th>
    //                         <th>NewDeaths</th>
    //                         <th>TotalRecovered</th>
    //                         <th>ActiveCases</th>
    //                         <th>Serious,Critical</th>
                            
    //                         <th>Tot Cases/1M pop</th>
    //                         <th>Deaths/1M pop</th>
    //                         <th>TotalTests</th>
    //                         <th>Tests/\n1M pop\n</th>
    //                         <th>Continent</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody id="myTable">
    //                     {
    //                         this.renderTable(tableData)
    
    //                     }
                        
    //                 </tbody>
    //                 </table>
    //             </div>
    //         </>
    //     )
    // }
    
    render() {
        return (
        
            // <div className="row text-center">
            //     <div className="col">
            //         {/* {this.renderWorldData()} */}
            //         {/* {this.renderMap()} */}
            //         <Tableau />
            //     </div>
            // </div>
            <>
                <div className="text-center">
                    <h1 className="text-dark">Total Cases</h1>
                    <h2 className="text-danger">{this.state.world.TotalCases}</h2>
                    <h1 className="text-dark">Total Recovered</h1>
                    <h2 className="text-success">{this.state.world.TotalRecovered}</h2>
                    
                    <h1 className="text-dark">Total Deaths</h1>
                    <h2 className="text-secondary">{this.state.world.TotalDeaths}</h2>
                </div>
                <Tableau />
            </>
            
        )
      }
    

}
export default WorldData