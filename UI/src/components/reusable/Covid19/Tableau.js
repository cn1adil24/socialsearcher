import React from 'react'
import tableauSoftware from 'tableau-api'

const url = 'https://public.tableau.com/views/CoronavirusWorldwideComparison/Sheet1?:display_count=n&:origin=viz_share_link'
class Tableau extends React.Component {

    componentDidMount() {
        this.initViz()
    }
    initViz(){

        const vizContainer = this.vizContainer;
        this.div = new window.tableauSoftware.Viz(vizContainer, url)
    }
    render() {

        return (

            <div ref={div => this.vizContainer = div}>

            </div>
        )
    }

}
export default Tableau