import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import React from 'react';

export const icons = {
  error: React.createElement(AlertTriangle, { className: "text-red-500 w-5 h-5" }),
  success: React.createElement(CheckCircle, { className: "text-green-500 w-5 h-5" }),
  info: React.createElement(Info, { className: "text-blue-500 w-5 h-5" }),
};
