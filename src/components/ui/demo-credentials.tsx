'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/services/auth';

interface DemoCredential {
  email: string;
  password: string;
  name: string;
  role: string;
  description: string;
}

interface DemoCredentialsProps {
  onCredentialSelect?: (email: string, password: string) => void;
}

export function DemoCredentials({ onCredentialSelect }: DemoCredentialsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [credentials, setCredentials] = useState<DemoCredential[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    authService.getDemoCredentials().then((demoCredentials) => {
      setCredentials(demoCredentials);
    });
  }, []);

  const handleCopyCredentials = async (credential: DemoCredential, index: number) => {
    try {
      await navigator.clipboard.writeText(`${credential.email}\n${credential.password}`);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback silencioso se clipboard não estiver disponível
    }
  };

  const handleCredentialClick = (credential: DemoCredential) => {
    if (onCredentialSelect) {
      onCredentialSelect(credential.email, credential.password);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Operator':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full p-3 space-x-2 transition-colors border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
      >
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
          {isExpanded ? 'Ocultar' : 'Ver'} Credenciais de Demonstração
        </span>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Usuários Disponíveis
                </h3>
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPasswords ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPasswords ? 'Ocultar' : 'Mostrar'} senhas</span>
                </button>
              </div>

              {/* Credentials List */}
              <div className="space-y-2">
                {credentials.map((credential, index) => (
                  <div
                    key={credential.email}
                    className="relative p-3 transition-colors border border-gray-200 rounded-lg cursor-pointer group bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600"
                    onClick={() => handleCredentialClick(credential)}
                  >
                    {/* User Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {credential.name}
                          </p>
                          <Badge className={`text-xs ${getRoleBadgeColor(credential.role)}`}>
                            {credential.role}
                          </Badge>
                        </div>
                        <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                          {credential.description}
                        </p>
                        
                        {/* Credentials */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                              📧 {credential.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                              🔑 {showPasswords ? credential.password : '••••••••'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCredentials(credential, index);
                        }}
                        className="p-1 transition-all rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Copiar credenciais"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  💡 Clique em qualquer credencial para preenchimento automático
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
