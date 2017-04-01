import { isObject, isArray, isString } from './util/identify'
import diffObjects from './diffObjects'
import diffArrays from './diffArrays'
import diffStrings from './diffStrings'
import { OLD, NEW } from './instructions'


export default function diff(thing1, thing2) {

  // optimized case: objects (add,remove,update)
  if (isObject(thing1) && isObject(thing2)) {
    return diffObjects(thing1, thing2)
  }

  // optimized case: arrays (add,remove,update,cut,paste)
  else if (isArray(thing1) && isArray(thing2)) {
    return diffArrays(thing1, thing2)
  }

  // optimized case: strings
  else if (isString(thing1) && isString(thing2)) {
    return diffStrings(thing1, thing2)
  }

  // typical case (add,remove)
  else {
    return {
      [OLD]: thing1,
      [NEW]: thing2,
    }
  }

}
