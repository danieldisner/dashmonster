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

export function BeneficiaryCardSkeleton() {
  return React.createElement('div', {
    className: 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse'
  }, [
    React.createElement('div', {
      key: 'content',
      className: 'flex flex-col sm:flex-row items-start justify-between gap-4'
    }, [
      React.createElement('div', {
        key: 'left',
        className: 'flex items-start space-x-4 flex-1 w-full'
      }, [
        React.createElement('div', {
          key: 'avatar',
          className: 'w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700'
        }),
        React.createElement('div', {
          key: 'info',
          className: 'flex-1 space-y-2'
        }, [
          React.createElement('div', {
            key: 'name',
            className: 'h-5 bg-gray-200 dark:bg-slate-700 rounded w-48'
          }),
          React.createElement('div', {
            key: 'detail1',
            className: 'h-4 bg-gray-200 dark:bg-slate-700 rounded w-32'
          }),
          React.createElement('div', {
            key: 'detail2',
            className: 'h-4 bg-gray-200 dark:bg-slate-700 rounded w-40'
          })
        ])
      ]),
      React.createElement('div', {
        key: 'actions',
        className: 'flex gap-2'
      }, [
        React.createElement('div', {
          key: 'btn1',
          className: 'h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded'
        }),
        React.createElement('div', {
          key: 'btn2',
          className: 'h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded'
        })
      ])
    ])
  ]);
}
