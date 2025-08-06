import React from 'react';
import { PasswordField } from '@payloadcms/ui';
import { FieldProps } from 'payload/types';

const CustomPasswordInput: React.FC<FieldProps> = (props) => {
  return <PasswordField {...props} />;
};

export default CustomPasswordInput;