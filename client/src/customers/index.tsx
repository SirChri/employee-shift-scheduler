/* eslint-disable import/no-anonymous-default-export */
import { CustomerList } from './CustomerList';
import { CustomerEdit } from './CustomerEdit';
import { CustomerCreate } from './CustomerCreate';

export default {
    list: CustomerList,
    create: CustomerCreate,
    edit: CustomerEdit
};