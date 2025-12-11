import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { OntologyNode, OntologyLink } from '../types';

export const OntologyGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Mock Ontology Data (based on "Business Entity extraction" from resume)
    const nodes: OntologyNode[] = [
      { id: "Customer", group: 1, radius: 25, label: "Customer" },
      { id: "Order", group: 1, radius: 25, label: "Order" },
      { id: "Product", group: 1, radius: 25, label: "Product" },
      { id: "SupportTicket", group: 1, radius: 20, label: "Ticket" },
      { id: "Invoice", group: 1, radius: 20, label: "Invoice" },
      { id: "has_order", group: 3, radius: 5, label: "has" },
      { id: "contains", group: 3, radius: 5, label: "contains" },
      { id: "raised_by", group: 3, radius: 5, label: "raised_by" },
      { id: "billed_to", group: 3, radius: 5, label: "billed_to" },
      { id: "email", group: 2, radius: 10, label: "email" },
      { id: "phone", group: 2, radius: 10, label: "phone" },
      { id: "sku", group: 2, radius: 10, label: "SKU" },
      { id: "price", group: 2, radius: 10, label: "price" },
      { id: "status", group: 2, radius: 10, label: "status" },
    ];

    const links: OntologyLink[] = [
      { source: "Customer", target: "has_order", value: 1 },
      { source: "has_order", target: "Order", value: 1 },
      { source: "Order", target: "contains", value: 1 },
      { source: "contains", target: "Product", value: 1 },
      { source: "SupportTicket", target: "raised_by", value: 1 },
      { source: "raised_by", target: "Customer", value: 1 },
      { source: "Invoice", target: "billed_to", value: 1 },
      { source: "billed_to", target: "Customer", value: 1 },
      { source: "Customer", target: "email", value: 1 },
      { source: "Customer", target: "phone", value: 1 },
      { source: "Product", target: "sku", value: 1 },
      { source: "Product", target: "price", value: 1 },
      { source: "Order", target: "status", value: 1 },
    ];

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 10));

    const link = svg.append("g")
      .attr("stroke", "#4B5563")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => {
        if (d.group === 1) return "#3B82F6"; // Entity: Blue
        if (d.group === 2) return "#10B981"; // Attribute: Green
        return "#6B7280"; // Relation: Gray
      })
      .call(drag(simulation) as any);

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("dy", (d) => d.group === 3 ? 0 : 35) // Offset text
      .attr("text-anchor", "middle")
      .attr("fill", "#E5E7EB")
      .attr("font-size", (d) => d.group === 3 ? "10px" : "12px")
      .attr("pointer-events", "none")
      .text((d) => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Ontology Knowledge Layer</h2>
        <p className="text-sm text-gray-400">Semantic Graph automatically extracted from business data (Insight Agent)</p>
      </div>
      <div ref={containerRef} className="flex-1 bg-nexus-900 border border-nexus-700 rounded-lg overflow-hidden shadow-inner">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};
