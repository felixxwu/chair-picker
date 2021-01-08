import { atom } from 'recoil';
import PeopleClass from '../classes/PeopleClass';

export default atom<PeopleClass>({
    key: 'people', 
    default: new PeopleClass([{id: '0', name: 'FW', hue: 0}, {id: '1', name: 'JD', hue: 0}])
})
