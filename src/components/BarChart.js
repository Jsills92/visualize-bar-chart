import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const ref = useRef(null);
  const width = 800;  // Set your width
  const height = 400; // Set your height

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
      .then((response) => response.json())
      .then((data) => {
        const parsedData = data.data.map(d => ({
          date: new Date(d[0]),
          gdp: d[1]
        }));

        // Set up the scales
        const xScale = d3.scaleTime()
          .domain([d3.min(parsedData, d => d.date), d3.max(parsedData, d => d.date)])
          .range([0, width]);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(parsedData, d => d.gdp)])
          .range([height, 0]);

        // Select the SVG element and set its dimensions
        const svg = d3.select(ref.current)
          .attr("width", width)
          .attr("height", height);

        // Append the x-axis
        svg.append("g")
          .attr("id", "x-axis")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(xScale));

        // Append the y-axis
        svg.append("g")
          .attr("id", "y-axis")
          .call(d3.axisLeft(yScale));

        // Render bars
        const barWidth = width / parsedData.length;
        svg.selectAll(".bar")
          .data(parsedData)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("data-date", d => d.date)
          .attr("data-gdp", d => d.gdp)
          .attr("x", (d, i) => xScale(d.date))
          .attr("y", d => yScale(d.gdp))
          .attr("width", barWidth)
          .attr("height", d => height - yScale(d.gdp));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return <svg ref={ref}></svg>;
};

export default BarChart;
