'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/providers/toast-provider';
import { Building2, Check, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Unit } from '@/types';

interface UnitSwitcherProps {
  units: Unit[];
  selectedUnit: string | null;
  onUnitChange: (unitId: string) => void;
  className?: string;
}

export function UnitSwitcher({ units, selectedUnit, onUnitChange, className }: UnitSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  // Verificação defensiva para garantir que units é um array
  const safeUnits = Array.isArray(units) ? units : [];
  const currentUnit = safeUnits.find(unit => unit.id === selectedUnit);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-unit-switcher]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const handleUnitSwitch = (unit: Unit) => {
    onUnitChange(unit.id);
    setIsOpen(false);
    
    showToast({
      type: 'success',
      title: 'Unidade alterada',
      description: `Agora visualizando: ${unit.name}`
    });
  };

  // Se não há unidades, não renderizar o componente
  if (!safeUnits || safeUnits.length === 0) {
    console.log('⚠️ UnitSwitcher: Não há unidades para exibir', { units, safeUnits });
    return null;
  }

  console.log('🏢 UnitSwitcher: Renderizando com', safeUnits.length, 'unidades');

  const getUnitStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  if (safeUnits.length === 0) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        <Building2 className="w-4 h-4" />
        <span>Nenhuma unidade disponível</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={`relative ${className}`} data-unit-switcher>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full gap-3 px-4 py-3 transition-colors bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center flex-1 gap-3">
          <div className="flex-shrink-0">
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          
          {currentUnit ? (
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {currentUnit.name}
                </span>
                <Badge className={getUnitStatusColor(currentUnit.isActive)}>
                  {currentUnit.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>{currentUnit.address}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-left">
              <span className="text-gray-600 dark:text-gray-300">
                Selecione uma unidade
              </span>
            </div>
          )}
        </div>
        
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg top-full dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                Selecionar Unidade
              </div>
              
              <div className="space-y-1">
                {safeUnits.map((unit) => (
                  <motion.button
                    key={unit.id}
                    onClick={() => handleUnitSwitch(unit)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-left transition-colors ${
                      selectedUnit === unit.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex-shrink-0">
                      {selectedUnit === unit.id ? (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {unit.name}
                        </span>
                        <Badge className={getUnitStatusColor(unit.isActive)}>
                          {unit.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{unit.address}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
