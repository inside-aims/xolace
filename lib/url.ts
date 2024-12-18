import qs from "query-string"

interface UrlQueryParams{
    params: string;
    key: string;
    value: string;
}

interface RemoveKeyFromQueryParams {
    params: string;
    keysToRemove: string[];
}

export const formUrlQuery = ({params , key , value}: UrlQueryParams) => {
    // change the params to object
    const paramsString = qs.parse(params);

    // appending if not already there or changing the value if already in the search params of the url
    paramsString[key] = value;
    
    // converting back to string and returning
    return qs.stringifyUrl({
        url: window.location.href,
        query: paramsString,
    })
}

export const removeKeyFromQuery = ({params , keysToRemove } : RemoveKeyFromQueryParams) =>{
     // change the params to object
     const paramsString = qs.parse(params);

     if (typeof paramsString === 'object' && paramsString !== null) {
        console.log("working-> ", paramsString)
        
        keysToRemove.forEach((key) => {
          delete paramsString[key];
        });
      }
     
     // converting back to string and returning
     return qs.stringifyUrl({
         url: window.location.href,
         query: paramsString,
     }, {
        skipNull: true
     })
}