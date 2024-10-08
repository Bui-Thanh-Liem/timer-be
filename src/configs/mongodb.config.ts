import { registerAs } from '@nestjs/config';
import { CONST_CONNECT_DATABASE } from 'src/constants/dataBase.cont';

export default registerAs(CONST_CONNECT_DATABASE, () => ({
  uri: process.env.MONGODB_URI || '',
}));
