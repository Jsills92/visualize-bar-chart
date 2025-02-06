import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import '../App.css'; // If you have this file

const BarChart = () => {
  const ref = useRef(null);
  const width = 800; // Set your width
  const height = 400; // Set your height

  useEffect(() => {
    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(data => {
        const yearsDate = data.data.map(item => new Date(item[0]));
        const GDP = data.data.map(item => item[1]);
        const gdpMax = d3.max(GDP);

        // Adjustments for SVG size
        const barWidth = width / 275;
        const svgContainer = d3.select(ref.current)
          .attr('width', width + 100)
          .attr('height', height + 60)
          .style('background', '#a4b6dd') // Dark background for business-like theme
          //.style('color', '#e0e0e0'); // Light text color for contrast

        // Create scales
        const xMax = new Date(d3.max(yearsDate));
        xMax.setMonth(xMax.getMonth() + 3); // Adjust the x-axis end date
        const xScale = d3.scaleTime().domain([d3.min(yearsDate), xMax]).range([0, width]);

        const linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);
        const yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yAxisScale);

        // Add x-axis and y-axis
        svgContainer
          .append('g')
          .call(xAxis)
          .attr('id', 'x-axis')
          .attr('transform', `translate(60, ${height})`)
          .style('color', '#e0e0e0');

        svgContainer
          .append('g')
          .call(yAxis)
          .attr('id', 'y-axis')
          .attr('transform', 'translate(60, 0)')
          .style('color', '#e0e0e0');  // Fixed y-axis color for consistency

        // Add bars
        svgContainer
          .selectAll('rect')
          .data(GDP)
          .enter()
          .append('rect')
          .attr('data-date', (d, i) => data.data[i][0])
          .attr('data-gdp', (d, i) => data.data[i][1])
          .attr('class', 'bar')
          .attr('x', (d, i) => xScale(yearsDate[i])) // Removed the additional +60 for correct alignment
          .attr('y', d => height - linearScale(d))
          .attr('width', barWidth)
          .attr('height', d => linearScale(d))
          .style('fill', (d, i) => {
            const year = yearsDate[i].getFullYear();
            if (year < 1960) return '#21134D'; // Purple-500 for 1950-1960 (darkest)
            if (year < 1970) return '#3D2785'; // Purple-400 for 1960-1970
            if (year < 1980) return '#5E40BE'; // Purple-300 for 1970-1980
            if (year < 1990) return '#876FD4'; // Purple-200 for 1980-1990
            return '#957aec'; // Purple-100 for 1990-2015 (lightest)
          })
          .attr('transform', 'translate(60, 0)') // Keep this if needed for full graph shifting
          .on('mouseover', function (event, d) {
            const i = this.getAttribute('data-date');
            const tooltip = d3.select("#tooltip");

            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip
            .html(`${i}<br>$${d.toFixed(1)} Billion`)
              .attr('data-date', i)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px')
              .style('background', '#333')
              .style('color', '#fff');
          })
          .on('mouseout', function () {
            d3.select("#tooltip").transition().duration(200).style('opacity', 0);
          });
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <div style={{ background: '#1a1a1b', minHeight: '100vh', padding: '20px', margin: 0 }}>
      <h2 id="title" style={{ color: '#e0e0e0', textAlign: 'center' }}>GDP Over Time</h2>
      <svg ref={ref}></svg>
      <div id="tooltip" style={{ position: 'absolute', opacity: 0, padding: '10px', borderRadius: '5px', pointerEvents: 'none' }}></div>
    </div>
  );
};

export default BarChart;
