import React from 'react';

export function LoadingSpinner() {
  return React.createElement('div', {
    className: 'flex flex-col items-center justify-center py-16'
  }, [
    React.createElement('div', {
      key: 'spinner',
      className: 'w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin'
    }),
    React.createElement('p', {
      key: 'text',
      className: 'mt-4 text-gray-600 dark:text-gray-400'
    }, 'Carregando beneficiários...')
  ]);
}





