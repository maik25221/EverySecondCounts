import { useTranslation } from 'react-i18next';
import { GoalCategory } from '../lib/models';
import { goalCategories, getCategoryConfig } from '../lib/categories';

interface CategorySelectorProps {
  value: GoalCategory;
  onChange: (category: GoalCategory) => void;
  disabled?: boolean;
}

export default function CategorySelector({ value, onChange, disabled = false }: CategorySelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('goals.category')}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {goalCategories.map((category) => {
          const isSelected = value === category.id;
          const config = getCategoryConfig(category.id);
          
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              disabled={disabled}
              className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? `border-${config.color}-500 bg-gradient-to-r ${config.gradient} ring-2 ring-${config.color}-200`
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{config.icon}</span>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {t(config.nameKey)}
                  </span>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <svg className={`w-4 h-4 text-${config.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}