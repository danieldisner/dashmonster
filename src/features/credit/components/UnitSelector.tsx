'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ChevronDown } from 'lucide-react';
import type { Unit } from '@/types';

interface UnitSelectorProps {
  units: Unit[];
  selectedUnit: string;
  onUnitChange: (unitId: string) => void;
  isLoading?: boolean;
}

export function UnitSelector({ units, selectedUnit, onUnitChange, isLoading = false }: UnitSelectorProps) {
  const selectedUnitData = units.find(unit => unit.id === selectedUnit);

  if (units.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Nenhuma unidade disponível
          </h3>
        </CardContent>
      </Card>
    );
  }

  if (units.length === 1) {
    const unit = units[0];
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5" />
            Unidade Selecionada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="font-semibold text-blue-900">{unit.name}</h3>
            {unit.description && (
              <p className="mt-1 text-sm text-blue-700">{unit.description}</p>
            )}
            <p className="mt-2 text-xs text-blue-600">
              Horário: {unit.operatingHours.open} - {unit.operatingHours.close}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="w-5 h-5" />
          Selecionar Unidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Selected unit display */}
        {selectedUnitData && (
          <div className="p-3 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">{selectedUnitData.name}</h4>
                {selectedUnitData.description && (
                  <p className="text-sm text-green-700">{selectedUnitData.description}</p>
                )}
                <p className="mt-1 text-xs text-green-600">
                  Horário: {selectedUnitData.operatingHours.open} - {selectedUnitData.operatingHours.close}
                </p>
              </div>
              <div className="text-green-600">
                ✓
              </div>
            </div>
          </div>
        )}

        {/* Unit selection buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Escolha uma unidade para distribuir créditos:
          </label>
          <div className="grid gap-2">
            {units.map((unit) => (
              <Button
                key={unit.id}
                variant={selectedUnit === unit.id ? "default" : "outline"}
                onClick={() => onUnitChange(unit.id)}
                disabled={isLoading}
                className={`justify-between p-4 h-auto ${
                  selectedUnit === unit.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{unit.name}</div>
                  {unit.description && (
                    <div className="text-sm opacity-75">{unit.description}</div>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  selectedUnit === unit.id ? 'rotate-180' : ''
                }`} />
              </Button>
            ))}
          </div>
        </div>

        {!selectedUnit && (
          <div className="p-4 text-center border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm text-yellow-800">
              💡 Selecione uma unidade para visualizar e gerenciar as distribuições de crédito
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
