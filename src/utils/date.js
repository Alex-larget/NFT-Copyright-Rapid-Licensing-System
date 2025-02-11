import dayjs from "dayjs";

export const formatDate = (date, format = "YYYY-MM-DD") => {
  return dayjs(date).format(format);
};

export const isExpired = (endDate) => {
  return dayjs().isAfter(dayjs(endDate));
};

export const getRemainingDays = (endDate) => {
  return dayjs(endDate).diff(dayjs(), "day");
};
