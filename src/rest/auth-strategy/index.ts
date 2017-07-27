import useGitHub from './github';
import useOpenID from './openid';

import { authStrategy } from '../../config';

export default () => {
  switch (authStrategy) {
    case 'openid':
      return useOpenID();
    case 'github':
    default:
      return useGitHub();
  }
}
