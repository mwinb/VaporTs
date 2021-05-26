import { String } from '@mwinberry/doc-ts';
import { isJsonContent } from '../Evaluators/isJsonContent';

export class JsonContentValidator {
  @String({ evaluators: [isJsonContent] })
  'content-type': string;
}

export default new JsonContentValidator();
