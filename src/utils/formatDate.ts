export const formatDate = (date: string) => {
  const formattedDate = date.replace(/\.$/, ""); // 끝에 있는 점만 제거
  return formattedDate;
};

export const convertUnixToDate = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000);

  return {
    default: `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`, // "2025.06.27"
    iso: date.toISOString(), // "2025-06-27T00:25:15.000Z"
    localeDate: date.toLocaleDateString(), // "2025. 6. 27."
    locale: date.toLocaleString(), // "2025. 6. 27. 오전 9:25:15"
    localeTime: date.toLocaleTimeString(), // "오전 9:25:15"
    utc: date.toUTCString(), // "Thu, 26 Jun 2025 15:25:15 GMT"
    fullDateTime: `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`, // "2025-06-27 09:25:15"
  };
}
