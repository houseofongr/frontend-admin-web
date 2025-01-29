export const formatDate = (date: string) => {
  const formattedDate = date.replace(/\.$/, ""); // 끝에 있는 점만 제거
  return formattedDate;
};
