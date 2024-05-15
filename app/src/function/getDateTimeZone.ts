export const getDateTimeZone = (ts:number,tz:string) => {
    const options = {
      timeZone: tz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // Use 12-hour format (true) or 24-hour format (false)
    };
    const dateUTC = new Date(ts)
    const dateontz = new Date(dateUTC.toLocaleString("en-US",{timeZone: tz}))
    return dateontz
  }