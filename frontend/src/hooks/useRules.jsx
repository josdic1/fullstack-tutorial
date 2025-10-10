import { useContext } from 'react';
import RulesContext from '../contexts/RulesContext';

export const useRules = () => {
  const context = useContext(RulesContext);
  if (!context) {
    throw new Error('useRules must be used within RulesProvider');
  }
  return context;
};