export const formatDateToString = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const timestamp = now.getTime();
  const minute = now.getMinutes();
  const hours = now.getHours();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return `${timestamp}_${seconds}-${minute}-${hours}-${day}-${month}-${year}`;
};
