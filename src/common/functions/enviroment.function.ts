export const isProduction = () => process.env.NODE_ENV === 'production';
export const isLocal = () => process.env.NODE_ENV === 'local';
export const isTest = () => process.env.NODE_ENV === 'test';
