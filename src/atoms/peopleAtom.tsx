import { atom } from 'recoil';
import PeopleClass from '../classes/PeopleClass';

export default atom<PeopleClass>({
    key: 'people', 
    default: new PeopleClass([])
})
