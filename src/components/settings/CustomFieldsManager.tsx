import React, { useState } from 'react';
import { PlusIcon, TrashIcon, MoveUpIcon, MoveDownIcon } from 'lucide-react';
interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date';
  placeholder?: string;
  options?: string[];
  required: boolean;
}
export const CustomFieldsManager: React.FC = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([{
    id: '1',
    label: 'Pickup Postal Code',
    type: 'text',
    placeholder: 'Enter pickup postal code',
    required: true
  }, {
    id: '2',
    label: 'Delivery Postal Code',
    type: 'text',
    placeholder: 'Enter delivery postal code',
    required: true
  }, {
    id: '3',
    label: 'Shipping Method',
    type: 'select',
    options: ['Standard', 'Express', 'Economy'],
    required: true
  }, {
    id: '4',
    label: 'Fragile Items',
    type: 'checkbox',
    required: false
  }, {
    id: '5',
    label: 'Estimated Delivery Date',
    type: 'date',
    required: false
  }]);
  const [newField, setNewField] = useState<Omit<CustomField, 'id'>>({
    label: '',
    type: 'text',
    placeholder: '',
    options: [],
    required: false
  });
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newOption, setNewOption] = useState('');
  const handleAddField = () => {
    if (newField.label) {
      const fieldToAdd: CustomField = {
        ...newField,
        id: Date.now().toString(),
        options: newField.type === 'select' ? [...(newField.options || [])] : undefined
      };
      setCustomFields([...customFields, fieldToAdd]);
      setNewField({
        label: '',
        type: 'text',
        placeholder: '',
        options: [],
        required: false
      });
      setIsAddFieldOpen(false);
    }
  };
  const handleAddOption = () => {
    if (newOption && !newField.options?.includes(newOption)) {
      setNewField({
        ...newField,
        options: [...(newField.options || []), newOption]
      });
      setNewOption('');
    }
  };
  const handleRemoveOption = (option: string) => {
    setNewField({
      ...newField,
      options: newField.options?.filter(opt => opt !== option)
    });
  };
  const handleDeleteField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };
  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...customFields];
    if (direction === 'up' && index > 0) {
      ;
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    } else if (direction === 'down' && index < customFields.length - 1) {
      ;
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    }
    setCustomFields(newFields);
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Custom Fields Manager
          </h1>
          <p className="text-gray-600">
            Add and manage custom fields for shipments
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center" onClick={() => setIsAddFieldOpen(true)}>
          <PlusIcon size={18} className="mr-2" />
          Add Custom Field
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {customFields.length > 0 ? <div className="space-y-4">
            {customFields.map((field, index) => <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {field.label}{' '}
                      {field.required && <span className="text-red-500">*</span>}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="capitalize">{field.type}</span>
                      {field.placeholder && ` • Placeholder: "${field.placeholder}"`}
                    </div>
                    {field.type === 'select' && field.options && field.options.length > 0 && <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Options:</p>
                          <div className="flex flex-wrap gap-1">
                            {field.options.map((option, i) => <span key={i} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                {option}
                              </span>)}
                          </div>
                        </div>}
                  </div>
                  <div className="flex">
                    <button className="p-1 text-gray-500 hover:text-gray-700" title="Move Up" onClick={() => moveField(index, 'up')} disabled={index === 0}>
                      <MoveUpIcon size={16} className={index === 0 ? 'text-gray-300' : ''} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700 ml-1" title="Move Down" onClick={() => moveField(index, 'down')} disabled={index === customFields.length - 1}>
                      <MoveDownIcon size={16} className={index === customFields.length - 1 ? 'text-gray-300' : ''} />
                    </button>
                    <button className="p-1 text-red-500 hover:text-red-700 ml-1" title="Delete" onClick={() => handleDeleteField(field.id)}>
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>)}
          </div> : <div className="text-center py-8 text-gray-500">
            <p>No custom fields added yet.</p>
            <p className="mt-2">
              Click "Add Custom Field" to create your first custom field.
            </p>
          </div>}
      </div>
      {isAddFieldOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add Custom Field</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Field Label
                </label>
                <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. Pickup Postal Code" value={newField.label} onChange={e => setNewField({
              ...newField,
              label: e.target.value
            })} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Field Type
                </label>
                <select className="w-full p-2 border rounded-lg" value={newField.type} onChange={e => setNewField({
              ...newField,
              type: e.target.value as CustomField['type'],
              placeholder: e.target.value === 'checkbox' ? '' : newField.placeholder
            })}>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date</option>
                </select>
              </div>
              {(newField.type === 'text' || newField.type === 'number') && <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Placeholder (Optional)
                  </label>
                  <input type="text" className="w-full p-2 border rounded-lg" placeholder="Enter placeholder text" value={newField.placeholder || ''} onChange={e => setNewField({
              ...newField,
              placeholder: e.target.value
            })} />
                </div>}
              {newField.type === 'select' && <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Options
                  </label>
                  <div className="flex mb-2">
                    <input type="text" className="flex-1 p-2 border rounded-l-lg" placeholder="Enter option" value={newOption} onChange={e => setNewOption(e.target.value)} />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-r-lg" onClick={handleAddOption}>
                      Add
                    </button>
                  </div>
                  {newField.options && newField.options.length > 0 ? <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">
                        Added Options:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {newField.options.map((option, i) => <div key={i} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs flex items-center">
                            {option}
                            <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveOption(option)}>
                              &times;
                            </button>
                          </div>)}
                      </div>
                    </div> : <p className="text-xs text-gray-500">
                      No options added yet
                    </p>}
                </div>}
              <div className="mb-6 flex items-center">
                <input type="checkbox" id="required" className="w-4 h-4 text-blue-600 border-gray-300 rounded" checked={newField.required} onChange={e => setNewField({
              ...newField,
              required: e.target.checked
            })} />
                <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                  Required field
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setIsAddFieldOpen(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddField}>
                  Add Field
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};