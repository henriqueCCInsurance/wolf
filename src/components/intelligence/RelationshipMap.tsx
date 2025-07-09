import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Link, Building } from 'lucide-react';
import { Contact, ContactRelationship, RelationshipType, RelationshipStrength } from '@/types';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';

interface RelationshipMapProps {
  contacts: Contact[];
  companyName: string;
  onUpdateRelationships?: (relationships: ContactRelationship[]) => void;
  editable?: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface ContactNode {
  id: string;
  companyName: string;
  contactName: string;
  position?: string;
  title?: string;
  nodePosition: Position;
  level: number;
}

const relationshipTypes: { value: RelationshipType; label: string }[] = [
  { value: 'reports-to', label: 'Reports To' },
  { value: 'works-with', label: 'Works With' },
  { value: 'influences', label: 'Influences' },
  { value: 'peer', label: 'Peer' },
  { value: 'dotted-line', label: 'Dotted Line' }
];

const relationshipStrengths: { value: RelationshipStrength; label: string; color: string }[] = [
  { value: 'strong', label: 'Strong', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'weak', label: 'Weak', color: '#ef4444' }
];

const RelationshipMap: React.FC<RelationshipMapProps> = ({
  contacts,
  companyName,
  onUpdateRelationships,
  editable = true
}) => {
  const [relationships, setRelationships] = useState<ContactRelationship[]>([]);
  const [nodes, setNodes] = useState<ContactNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [newRelationship, setNewRelationship] = useState<Partial<ContactRelationship>>({
    type: 'reports-to',
    strength: 'medium'
  });
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize relationships from contacts
  useEffect(() => {
    const allRelationships: ContactRelationship[] = [];
    contacts.forEach(contact => {
      if (contact.relationships) {
        allRelationships.push(...contact.relationships);
      }
    });
    setRelationships(allRelationships);
  }, [contacts]);

  // Calculate node positions based on organizational hierarchy
  useEffect(() => {
    const positionedNodes = calculateNodePositions(contacts, relationships);
    setNodes(positionedNodes);
  }, [contacts, relationships]);

  const calculateNodePositions = (contactList: Contact[], relationships: ContactRelationship[]): ContactNode[] => {
    // Group contacts by their organizational level
    const levels: { [key: number]: Contact[] } = {};
    const contactLevels: { [key: string]: number } = {};

    // First pass: identify executives (level 0)
    contactList.forEach(contact => {
      const title = (contact.position || contact.title || '').toLowerCase();
      if (
        title.includes('ceo') || title.includes('chief') || 
        title.includes('president') || title.includes('vp') ||
        title.includes('director') || title.includes('executive')
      ) {
        contactLevels[contact.id] = 0;
        if (!levels[0]) levels[0] = [];
        levels[0].push(contact);
      }
    });

    // Second pass: identify direct reports (level 1)
    relationships.forEach(rel => {
      if (rel.type === 'reports-to' && contactLevels[rel.toContactId] === 0) {
        const reportingContact = contactList.find(c => c.id === rel.fromContactId);
        if (reportingContact && contactLevels[rel.fromContactId] === undefined) {
          contactLevels[rel.fromContactId] = 1;
          if (!levels[1]) levels[1] = [];
          levels[1].push(reportingContact);
        }
      }
    });

    // Third pass: everyone else (level 2)
    contactList.forEach(contact => {
      if (contactLevels[contact.id] === undefined) {
        contactLevels[contact.id] = 2;
        if (!levels[2]) levels[2] = [];
        levels[2].push(contact);
      }
    });

    // Calculate positions
    const horizontalSpacing = 250;
    const verticalSpacing = 150;
    const startY = 50;

    const positionedNodes: ContactNode[] = [];

    Object.keys(levels).forEach(levelKey => {
      const level = parseInt(levelKey);
      const levelContacts = levels[level];
      const totalWidth = levelContacts.length * horizontalSpacing;
      const startX = (800 - totalWidth) / 2 + horizontalSpacing / 2;

      levelContacts.forEach((contact, index) => {
        positionedNodes.push({
          id: contact.id,
          companyName: contact.companyName,
          contactName: contact.contactName,
          position: contact.position,
          title: contact.title,
          nodePosition: {
            x: startX + index * horizontalSpacing,
            y: startY + level * verticalSpacing
          },
          level
        });
      });
    });

    return positionedNodes;
  };

  const handleAddRelationship = () => {
    if (selectedNode && newRelationship.toContactId && selectedNode !== newRelationship.toContactId) {
      const relationship: ContactRelationship = {
        id: `rel-${Date.now()}`,
        fromContactId: selectedNode,
        toContactId: newRelationship.toContactId,
        type: newRelationship.type || 'reports-to',
        strength: newRelationship.strength || 'medium',
        notes: newRelationship.notes
      };

      const updatedRelationships = [...relationships, relationship];
      setRelationships(updatedRelationships);
      onUpdateRelationships?.(updatedRelationships);
      
      setIsAddingRelationship(false);
      setNewRelationship({ type: 'reports-to', strength: 'medium' });
    }
  };

  const handleDeleteRelationship = (relId: string) => {
    const updatedRelationships = relationships.filter(r => r.id !== relId);
    setRelationships(updatedRelationships);
    onUpdateRelationships?.(updatedRelationships);
  };

  const getRelationshipPath = (from: ContactNode, to: ContactNode, type: RelationshipType): string => {
    const fromX = from.nodePosition.x;
    const fromY = from.nodePosition.y + 40;
    const toX = to.nodePosition.x;
    const toY = to.nodePosition.y - 10;

    if (type === 'reports-to') {
      // Straight line for reporting relationships
      return `M ${fromX} ${fromY} L ${toX} ${toY}`;
    } else {
      // Curved line for other relationships
      const midY = (fromY + toY) / 2;
      return `M ${fromX} ${fromY} Q ${fromX} ${midY} ${toX} ${toY}`;
    }
  };

  const getRelationshipColor = (strength: RelationshipStrength) => {
    const strengthConfig = relationshipStrengths.find(s => s.value === strength);
    return strengthConfig?.color || '#6b7280';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Building className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{companyName} - Organizational Map</h3>
        </div>
        {editable && selectedNode && (
          <div className="flex items-center space-x-2">
            {!isAddingRelationship ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingRelationship(true)}
              >
                <Link className="w-4 h-4 mr-1" />
                Add Relationship
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Select
                  value={newRelationship.toContactId || ''}
                  onChange={(value) => setNewRelationship({ ...newRelationship, toContactId: value })}
                  options={[
                    { value: '', label: 'Select Contact' },
                    ...nodes.filter(n => n.id !== selectedNode).map(node => ({
                      value: node.id,
                      label: node.contactName
                    }))
                  ]}
                  className="w-40"
                />
                <Select
                  value={newRelationship.type || 'reports-to'}
                  onChange={(value) => setNewRelationship({ ...newRelationship, type: value as RelationshipType })}
                  options={relationshipTypes}
                  className="w-32"
                />
                <Select
                  value={newRelationship.strength || 'medium'}
                  onChange={(value) => setNewRelationship({ ...newRelationship, strength: value as RelationshipStrength })}
                  options={relationshipStrengths.map(s => ({ value: s.value, label: s.label }))}
                  className="w-24"
                />
                <Button size="sm" onClick={handleAddRelationship}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsAddingRelationship(false);
                    setNewRelationship({ type: 'reports-to', strength: 'medium' });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <svg
          ref={svgRef}
          width="800"
          height={Math.max(400, nodes.length > 0 ? Math.max(...nodes.map(n => n.nodePosition.y)) + 100 : 400)}
          className="w-full"
          viewBox={`0 0 800 ${Math.max(400, nodes.length > 0 ? Math.max(...nodes.map(n => n.nodePosition.y)) + 100 : 400)}`}
        >
          {/* Render relationships */}
          {relationships.map(rel => {
            const fromNode = nodes.find(n => n.id === rel.fromContactId);
            const toNode = nodes.find(n => n.id === rel.toContactId);
            
            if (!fromNode || !toNode) return null;

            const path = getRelationshipPath(fromNode, toNode, rel.type);
            const color = getRelationshipColor(rel.strength);
            const isDotted = rel.type === 'dotted-line';

            return (
              <g key={rel.id}>
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray={isDotted ? "5,5" : undefined}
                  markerEnd={rel.type === 'reports-to' || rel.type === 'influences' ? `url(#arrow-${rel.strength})` : undefined}
                />
                {editable && (
                  <path
                    d={path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={20}
                    className="cursor-pointer hover:stroke-red-200"
                    onClick={() => handleDeleteRelationship(rel.id)}
                  />
                )}
              </g>
            );
          })}

          {/* Arrow markers */}
          <defs>
            {relationshipStrengths.map(strength => (
              <marker
                key={`arrow-${strength.value}`}
                id={`arrow-${strength.value}`}
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="10"
                markerHeight="10"
                orient="auto"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill={strength.color}
                />
              </marker>
            ))}
          </defs>

          {/* Render nodes */}
          {nodes.map(node => {
            const isSelected = selectedNode === node.id;
            const roleLevel = node.level === 0 ? 'Executive' : node.level === 1 ? 'Manager' : 'Individual Contributor';
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.nodePosition.x - 100}, ${node.nodePosition.y - 40})`}
                className={`cursor-pointer ${editable ? 'hover:opacity-80' : ''}`}
                onClick={() => editable && setSelectedNode(isSelected ? null : node.id)}
              >
                <rect
                  width="200"
                  height="80"
                  rx="8"
                  fill={isSelected ? '#e0e7ff' : '#f9fafb'}
                  stroke={isSelected ? '#6366f1' : '#e5e7eb'}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <foreignObject width="200" height="80">
                  <div className="p-3 h-full flex flex-col justify-center">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {node.contactName}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {node.position || node.title || 'No Title'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {roleLevel}
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Relationship Strength:</span>
            {relationshipStrengths.map(strength => (
              <div key={strength.value} className="flex items-center space-x-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: strength.color }}
                />
                <span className="text-gray-600">{strength.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-gray-500">
          {editable && 'Click a contact to add relationships'}
        </div>
      </div>
    </div>
  );
};

export default RelationshipMap;