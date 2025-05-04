import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TaskForm = ({ onSubmit, initialValues = null, onCancel = null }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setIsEditing(!!initialValues);
  }, [initialValues]);
  
  const taskSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    priority: Yup.string().oneOf(['low', 'medium', 'high']),
    dueDate: Yup.date().nullable()
  });
  
  const defaultValues = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  };
  
  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    const formattedValues = {
      ...values,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null
    };
    
    onSubmit(formattedValues);
    
    if (!isEditing) {
      resetForm();
    }
    
    setSubmitting(false);
    
    if (isEditing && onCancel) {
      onCancel();
    }
  };
  
  return (
    <div className="card mb-6">
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={taskSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title*
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  placeholder="What needs to be done?"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="form-input min-h-[80px]"
                  placeholder="Add details about this task..."
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <Field
                    as="select"
                    id="priority"
                    name="priority"
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <Field
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                {isEditing && onCancel && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEditing ? 'Updating...' : 'Adding...'
                    : isEditing ? 'Update Task' : 'Add Task'
                  }
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaskForm;