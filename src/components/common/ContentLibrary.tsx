import React, { useState } from 'react';
import { Plus, Check, Target, Brain, Shield } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import AdvancedObjectionHandler from './AdvancedObjectionHandler';
import { useAppStore } from '@/store';
import { contentLibrary } from '@/data/content';
import { ContentItem } from '@/types';

const ContentLibrary: React.FC = () => {
  const { prospect, selectedContent, addSelectedContent, removeSelectedContent } = useAppStore();
  const [activeTab, setActiveTab] = useState<'opener' | 'thought-leadership' | 'objection-handler'>('opener');

  if (!prospect) {
    return (
      <Card title="Content Library">
        <p className="text-gray-500 text-center py-8">
          Complete lead acquisition first to access personalized content
        </p>
      </Card>
    );
  }

  const availableContent = contentLibrary.filter(item => 
    item.persona === prospect.persona || item.persona === 'gatekeeper'
  );

  const contentByType = {
    opener: availableContent.filter(item => item.type === 'opener'),
    'thought-leadership': availableContent.filter(item => item.type === 'thought-leadership'),
    'objection-handler': availableContent.filter(item => item.type === 'objection-handler')
  };

  const isSelected = (item: ContentItem) => {
    return selectedContent.some(selected => selected.id === item.id);
  };

  const handleToggleContent = (item: ContentItem) => {
    if (isSelected(item)) {
      removeSelectedContent(item.id);
    } else {
      addSelectedContent(item);
    }
  };

  const tabs = [
    { id: 'opener' as const, label: 'Openers', icon: Target, count: contentByType.opener.length },
    { id: 'thought-leadership' as const, label: 'Thought Leadership', icon: Brain, count: contentByType['thought-leadership'].length },
    { id: 'objection-handler' as const, label: 'Objection Handlers', icon: Shield, count: contentByType['objection-handler'].length }
  ];


  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Items */}
      <div className="space-y-4">
        {activeTab === 'objection-handler' ? (
          <AdvancedObjectionHandler persona={prospect.persona} />
        ) : (
          contentByType[activeTab].map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 transition-colors ${
              isSelected(item) ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-2">
                  {item.content}
                </p>
                {item.context && (
                  <p className="text-sm text-gray-600 italic">
                    {item.context}
                  </p>
                )}
                {item.source && (
                  <p className="text-sm text-gray-500 mt-1">
                    Source: {item.source}
                  </p>
                )}
                {item.dataPoints && item.dataPoints.length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {item.dataPoints.map((dp, idx) => (
                      <span key={idx}>
                        {dp.statistic}: {dp.value} ({dp.source}{dp.year ? `, ${dp.year}` : ''})
                        {idx < item.dataPoints!.length - 1 && ' • '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleToggleContent(item)}
                variant={isSelected(item) ? 'primary' : 'outline'}
                size="sm"
                className="ml-4 flex-shrink-0"
              >
                {isSelected(item) ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Selected
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>
          ))
        )}
        
        {activeTab !== 'objection-handler' && contentByType[activeTab].length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {activeTab.replace('-', ' ')} content available for this persona
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedContent.length > 0 && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 className="font-semibold text-primary-900 mb-2">
            Selected Content ({selectedContent.length} items)
          </h4>
          <div className="space-y-1">
            {selectedContent.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-primary-800">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('-', ' ')}: {item.content.substring(0, 50)}...
                </span>
                <button
                  onClick={() => removeSelectedContent(item.id)}
                  className="text-primary-600 hover:text-primary-800 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;