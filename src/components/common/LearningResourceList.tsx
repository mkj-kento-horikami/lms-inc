import React from 'react';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface LearningResourceListProps {
  resources: LearningResource[];
}

const LearningResourceList: React.FC<LearningResourceListProps> = ({ resources }) => {
  return (
    <div>
      <h2>Learning Resources</h2>
      <ul>
        {resources.map(resource => (
          <li key={resource.id}>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">View Resource</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningResourceList;