
var state = true;

const margin = ({top: 20, right: 40, bottom: 20, left: 40})

const width = 1000 - margin.left - margin.right,
height = 750 - margin.top - margin.bottom;

const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3
    .scaleBand()
    .range([0, 800])
    .round(true)
    .paddingInner(0.1)

const yScale = d3
    .scaleLinear()
    .range([height,0])

const xAxis = d3.axisBottom()
	.scale(xScale)
	.ticks(10, "s")

const yAxis = d3.axisLeft()
	.scale(yScale)
	.ticks(10, "s")

svg.append("g")
.attr("class", "xAxis")

svg.append("g")
.attr("class", "yAxis")

svg.append("text")
.attr("class", "y label")

let type = d3.select('.group-by').node().value

let sort = d3.select('.sort').node().value


function update(data, type){
    yScale.domain([0,d3.max(data.map(d=>d[type]))])
	xScale.domain(data.map(d=>d.company))

	const bars = svg.selectAll('.bar')
    .data(data);

    bars.enter()
    .append('rect')
    .attr('x', d=>xScale(d.company))
    .attr("y", (d)=> yScale(d[type]))
    .merge(bars)
    .transition()
    .duration(1000)
    .delay(1000)
    .attr('x', d=>xScale(d.company))
    .attr('y', d => yScale(d[type]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d[type]))
    .attr('stroke', 'black')
    .attr('fill', '#69a3b2')
    .attr("class","bar");

    bars.exit()
    .transition()
    .duration(1000)
    .remove();

    svg.select(".xAxis")
    .transition()
    .duration(1000)
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

    svg.select(".yAxis")
    .transition()
    .duration(1000)
    .call(yAxis)
    .attr("transform", `translate(0, 0)`)

    svg.select(".y")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(type);
}

// ----Load Dataset----

d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{

    update(data, type)

    document.querySelector("#group-by").addEventListener('change', (x)=> {
        type= x.target.value;
        update(data, type);

    })

    document.querySelector('').onclick= (function() {


        if (state == true) {
            update(data.sort((a,b) => b[type] - a[type]), type);
            state = false; 

        }
        else {
            update(data.sort((a,b) => a[type] - b[type]), type);
            state = true;

        }  

    })

})



