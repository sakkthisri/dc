import React from 'react';
import { useParams } from 'react-router-dom';
import { getModuleById } from '../data/modules';
import { VisualizerLayout } from '../components/visualizer/VisualizerLayout';
import { NotFound } from './NotFound';

export function ModulePage() {
  const { moduleId } = useParams();
  const module = getModuleById(moduleId);

  if (!module) {
    return <NotFound title="Module Not Found" description="The requested visualizer topic could not be located in the syllabus dataset." />;
  }

  return (
    <VisualizerLayout module={module} />
  );
}
