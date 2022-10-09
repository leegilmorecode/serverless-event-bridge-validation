import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajvOptions = {
  allErrors: true,
};

// as this is not a monorepo and an example repo only we are using a typescript path alias
// whereas this would typically be published to npm and reused in all domain service
export function validate(
  obj: Record<string, any>,
  schema: Record<string, any>,
  key: string,
  ref: string
): void {
  const ajv = new Ajv(ajvOptions);
  addFormats(ajv);

  ajv.addVocabulary(['openapi', 'info', 'paths', 'components']);

  ajv.addSchema(schema, key);

  const valid = ajv.validate({ $ref: ref }, obj);

  if (!valid) {
    const errorMessage = JSON.stringify(ajv.errors);
    throw new Error(errorMessage);
  }
}
