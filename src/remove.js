import search from './search';
import { requireType, requireInstance, isType } from './util';

// TODO unfinished 
function remove(element, delay){
	
    if (delay) {
		requireType(delay, "number");
        setTimeout(remove, delay, element);
    } else {
		
        if (isType(element, 'string'))
            element = search(element);
			
        if (element[0]) { // array like
            let i = element.length;
            while (i--)
                remove(element[i]);
			
			return;
        }
		
		requireInstance(element, HTMLElement);
		
        if (element.parentNode)
            element.parentNode.removeChild(element);

	}
}

export remove;