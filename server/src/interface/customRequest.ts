
import {Request} from 'express';
import { Authpayload } from './Auth.dto';

export interface RequestCustom extends Request
{
    user: Authpayload;
}