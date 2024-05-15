export function formatPhoneNumber(phoneNumber : string) {
    // Remove all non-digit characters from the input
    const digitsOnly = phoneNumber.replace(/\D/g, '');
  
    // Extract the area code and local number
    const areaCode = digitsOnly.slice(0, 3);
    const localNumber = digitsOnly.slice(3);
  
    // Format the number with dashes
    return phoneNumber.includes('@') ? phoneNumber : `${areaCode}-${localNumber.slice(0, 3)}-${localNumber.slice(3)}`;
  }

export function formatType(type : string) {
  if(type === "iMessage"){
    return "IMES"
  }else if(type === "WhatsApp"){
    return "WA"
  }else{
    return type
  }
}