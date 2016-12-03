export function exists(object: any): boolean {
  return (typeof object) !== 'undefined' && object !== null;
}

// returns keys as array for hash or map
export function keys(hashMap): any[] {
  if (hashMap instanceof Map) {
    return Array.from(hashMap.keys());
  } else if (hashMap instanceof Object) {
    return Array.from(hashToMap(hashMap).keys());
  }
}

// turn an es5 hash into es6 map
export function hashToMap(hash): Map<any, any> {
  let keys = Object.keys(hash);
  let keyValuePairs = [];

  keys.forEach((key) => {
    keyValuePairs.push([key, hash[key]]);
  });

  return new Map<any, any>(keyValuePairs);
}