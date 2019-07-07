export default (...validationFieldNames: string[]) => (
  expect.objectContaining({
    code: 3,
    data: {
      errors: expect.arrayContaining(
        validationFieldNames.map(name => (
          expect.objectContaining({ param: name })
        )),
      ),
    },
  })
);
