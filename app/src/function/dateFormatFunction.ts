export const getDateString = (date: Date | null | undefined) => {
  if(!date !== null && !date !== undefined){
    const day = date?.toLocaleString("default", { day: "2-digit" });
    const month = date?.toLocaleDateString("default", { month: "2-digit" });
    const year = date?.toLocaleDateString("default", { year: "numeric" });
    return year + "-" + month + "-" + day;
  }else{
    return "Error please input Date!"
  }
  };