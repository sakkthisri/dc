import React from 'react';
import { Node } from './Node';
import { MessagePacket } from './MessagePacket';

export function NodeGraph({ 
  nodes = [], 
  messages = [], 
  connections = [],
  selectedNodeId,
  onNodeClick,
  showClock = true,
  showVector = false,
  height = 360
}) {
  return (
    <div 
      className="relative w-full h-full min-h-[340px] flex items-center justify-center overflow-hidden"
      style={{ minHeight: `${height}px` }}
    >
      {/* SVG Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="20"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" opacity="0.6" />
          </marker>
        </defs>

        {connections.map((conn, idx) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#line-gradient)"
              strokeWidth="2"
              strokeDasharray={conn.dashed ? "4 4" : undefined}
              markerEnd={conn.directed ? "url(#arrowhead)" : undefined}
            />
          );
        })}
      </svg>

      {/* Message Packets Overlay */}
      {messages.map((msg, idx) => {
        const fromNode = nodes.find(n => n.id === msg.from);
        const toNode = nodes.find(n => n.id === msg.to);
        if (!fromNode || !toNode) return null;

        return (
          <MessagePacket
            key={msg.id || idx}
            message={{
              ...msg,
              fromPos: { x: fromNode.x, y: fromNode.y },
              toPos: { x: toNode.x, y: toNode.y }
            }}
          />
        );
      })}

      {/* Nodes Overlay */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          onClick={onNodeClick}
          showClock={showClock}
          showVector={showVector}
        />
      ))}
    </div>
  );
}
