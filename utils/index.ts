

/**
 * Returns the Title Case of a given string
 * https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */

export function toTitleCase(str: string | undefined) {
    if (!str) return;
  
    return str.replace(/\b\w+('\w{1})?/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }


  // util function to check if string is a valid url
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};


// utils function to substitute {username} with actual username if it is present
export const substituteUsername = (str: string, username: string) => {
  if (str.includes('{username}')) {
    return str.replace('{username}', username);
  }
  return str;
};

