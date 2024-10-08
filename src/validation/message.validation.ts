export const isEmpty = (field: string) => {
  return `${field} không được để trống`;
};

export const minLength = (field: string, min: number) => {
  return `${field} không được nhỏ hơn ${min} kí tự`;
};

export const maxLength = (field: string, max: number) => {
  return `${field} không được lớn hơn ${max} kí tự`;
};

export const minValue = (field: string, min: number) => {
  return `${field} không được nhỏ hơn ${min}`;
};

export const maxValue = (field: string, max: number) => {
  return `${field} không được lớn hơn ${max}`;
};

export const isPhone = (field: string) => {
  return `${field} không đúng định dạng số điện thoại`;
};

export const isEmail = (field: string) => {
  return `${field} không đúng định dạng email`;
};

export const general = (field: string) => {
  return `${field} không được chứa kí tự đặt biệt`;
};
